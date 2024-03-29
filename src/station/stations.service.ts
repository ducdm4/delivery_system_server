import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { StationEntity } from '../typeorm/entities/station.entity';
import { WardEntity } from '../typeorm/entities/ward.entity';
import { PhotoEntity } from '../typeorm/entities/photo.entity';
import { RouteEntity } from '../typeorm/entities/route.entity';
import { ConfigsService } from 'src/config/configs.service';
import { STATION_CONNECTED_PATH_KEY } from 'src/common/constant';

@Injectable()
export class StationsService {
  constructor(
    @Inject('STATION_REPOSITORY')
    private stationRepository: Repository<StationEntity>,
    @Inject('ROUTE_REPOSITORY')
    private routeRepository: Repository<RouteEntity>,
    private configService: ConfigsService,
  ) {}

  async getListStation(filter) {
    const stationQuery = this.stationRepository.createQueryBuilder('station');
    stationQuery.leftJoin(
      'stations',
      'stationB',
      'station.parentStationId = stationB.id',
    );
    stationQuery.leftJoin(
      'addresses',
      'address',
      'station.addressId = address.id',
    );
    stationQuery.leftJoin('wards', 'ward', 'ward.id = address.wardId');
    stationQuery.leftJoin(
      'districts',
      'district',
      'district.id = address.districtId',
    );
    stationQuery.leftJoin('cities', 'city', 'city.id = address.cityId');
    stationQuery.leftJoin('streets', 'street', 'street.id = address.streetId');
    stationQuery.select([
      'station.*',
      'address.building',
      'address.detail',
      'street.name as streetName',
      'stationB.name as parentStationName',
      'ward.name as wardName',
      'district.name as districtName',
      'city.name as cityName',
    ]);
    if (filter.keyword) {
      stationQuery.andWhere('station.name LIKE :keyword', {
        keyword: `%${filter.keyword}%`,
      });
    }
    if (filter.filter.length) {
      filter.filter.forEach((filterItem) => {
        if (filterItem.key === 'type') {
          stationQuery.andWhere(`station.type = :type`, {
            type: filterItem.value,
          });
        } else {
          stationQuery.andWhere(`address.districtId = :did`, {
            did: filterItem.value,
          });
        }
      });
    }
    if (filter.sort.length) {
      filter.sort.forEach((sortItem) => {
        if (sortItem.key === 'parentStation') {
          stationQuery.orderBy(
            `station.parentStationId`,
            sortItem.value.toUpperCase(),
          );
        } else {
          stationQuery.orderBy(
            `station.${sortItem.key}`,
            sortItem.value.toUpperCase(),
          );
        }
      });
    }
    const totalStation = await stationQuery.getCount();
    if (filter.page) {
      stationQuery.offset((filter.page - 1) * filter.limit);
      stationQuery.limit(filter.limit);
    }
    const stationList = await stationQuery.getRawMany();
    return {
      page: filter.page,
      total: totalStation,
      list: stationList,
    };
  }

  async getStationById(id: number) {
    const station = await this.stationRepository.findOne({
      relations: {
        address: {
          ward: true,
          street: true,
          district: true,
          city: true,
        },
        parentStation: true,
        stationConnected: true,
        photos: true,
        wards: true,
      },
      where: {
        id,
      },
    });
    if (station) {
      return station;
    } else {
      throw new NotFoundException('station not found');
    }
  }

  async getStationByWard(id: number) {
    const stationQuery = this.stationRepository.createQueryBuilder('station');
    stationQuery.select([
      'station.id as id',
      'station.name as stationName',
      'station.parentStationId as parentId',
      'station.type as type',
      'w2.name as wardName',
      'ct.name as cityName',
      'dt.name as districtName',
      'st.name as streetName',
      'add.building as buildingName',
      'add.detail as addDetail',
    ]);
    stationQuery.leftJoin('wards', 'w', 'station.id = w.stationId');
    stationQuery.leftJoin('addresses', 'add', 'station.addressId = add.id');
    stationQuery.leftJoin('wards', 'w2', 'add.wardId = w2.id');
    stationQuery.leftJoin('cities', 'ct', 'ct.id = add.cityId');
    stationQuery.leftJoin('districts', 'dt', 'dt.id = add.districtId');
    stationQuery.leftJoin('streets', 'st', 'st.id = add.streetId');
    stationQuery.andWhere(`w.id = :wid`, {
      wid: id,
    });
    return await stationQuery.getRawOne();
  }

  async getChildStation(id: number) {
    const stationInRoute = await this.routeRepository.find({
      relations: {
        childStation: true,
      },
      where: {
        station: {
          id,
        },
        type: 0,
      },
    });
    let stationList = [];
    stationInRoute.forEach((item) => {
      stationList = [...stationList, ...item.childStation];
    });
    const station = await this.stationRepository.find({
      relations: {
        address: {
          ward: true,
          street: true,
          district: true,
          city: true,
        },
        parentStation: true,
        photos: true,
        wards: true,
      },
      where: {
        parentStation: {
          id,
        },
        id: Not(In(stationList.map((item) => item.id))),
      },
    });
    if (station) {
      return station;
    } else {
      throw new NotFoundException('station not found');
    }
  }

  async createStation(stationData: CreateStationDto) {
    const newStation = this.stationRepository.create({
      ...stationData,
      address: {
        id: stationData.addressId,
      },
      parentStation: {
        id: stationData.parentStationId,
      },
      createdAt: new Date(),
    });
    const data = await this.stationRepository.save(newStation);

    // add new connected
    for (let i = 0; i < stationData.stationConnected.length; i++) {
      const stationReverse = await this.stationRepository.findOne({
        relations: {
          stationConnected: true,
        },
        where: {
          id: stationData.stationConnected[i].id,
        },
      });
      const stationReverseItem = new StationEntity();
      stationReverseItem.id = data.id;
      stationReverse.stationConnected.push(stationReverseItem);
      await this.stationRepository.save(stationReverse);
    }

    return data;
  }

  async updateStationInfo(data: UpdateStationDto, id: number) {
    const checkStation = await this.getStationById(id);
    if (checkStation) {
      const station = checkStation;
      station.name = data.name;
      station.type = data.type;
      if (data.parentStationId) {
        station.parentStation.id = data.parentStationId;
      }
      const wards = [];
      data.wards.forEach((ward) => {
        const wardItem = new WardEntity();
        wardItem.id = ward.id;
        wards.push(wardItem);
      });
      const stationConnected = station.stationConnected;

      const needToRemoveConnected = !data.stationConnected.length
        ? station.stationConnected
        : station.stationConnected.filter((item) => {
            return data.stationConnected.findIndex((x) => x.id === item.id) < 0;
          });
      const needToAddConnected = !station.stationConnected.length
        ? data.stationConnected
        : data.stationConnected.filter((item) => {
            return (
              station.stationConnected.findIndex((x) => x.id === item.id) < 0
            );
          });
      // remove old connected
      for (let i = 0; i < needToRemoveConnected.length; i++) {
        const index1 = stationConnected.findIndex(
          (x) => x.id === needToRemoveConnected[i].id,
        );
        stationConnected.splice(index1, 1);
        const stationDelete = await this.stationRepository.findOne({
          relations: {
            stationConnected: true,
          },
          where: {
            id: needToRemoveConnected[i].id,
          },
        });
        const index = stationDelete.stationConnected.findIndex(
          (x) => x.id === id,
        );
        stationDelete.stationConnected.splice(index, 1);
        await this.stationRepository.save(stationDelete);
      }

      // add new connected
      for (let i = 0; i < needToAddConnected.length; i++) {
        const staItem = new StationEntity();
        staItem.id = needToAddConnected[i].id;
        stationConnected.push(staItem);
        const stationReverse = await this.stationRepository.findOne({
          relations: {
            stationConnected: true,
          },
          where: {
            id: needToAddConnected[i].id,
          },
        });
        const stationReverseItem = new StationEntity();
        stationReverseItem.id = id;
        stationReverse.stationConnected.push(stationReverseItem);
        await this.stationRepository.save(stationReverse);
      }

      station.wards = wards;
      station.stationConnected = stationConnected;
      const photos = [];
      data.photos.forEach((photo) => {
        const photoItem = new PhotoEntity();
        photoItem.id = photo.id;
        photos.push(photoItem);
      });
      station.photos = photos;
      const result = await this.stationRepository.save(station);
      this.reCalStationGraph();
      return result;
    }

    return false;
  }

  async deleteStation(id) {
    const checkStation = await this.getStationById(id);
    if (checkStation) {
      const result = await this.stationRepository.softDelete(id);
      return result;
    }
  }

  async getStationWithSameType(type: number) {
    const stationsList = await this.stationRepository.find({
      where: {
        type,
      },
    });
    return stationsList;
  }

  async reCalStationGraph() {
    const allStation = await this.stationRepository.find({
      select: {
        parentStation: {
          id: true,
        },
        stationConnected: {
          id: true,
        },
      },
      relations: {
        stationConnected: true,
        parentStation: true,
      },
    });
    const stationPair = [];
    allStation.forEach((station) => {
      if (station.parentStation) {
        stationPair.push({ s: station.id, f: station.parentStation.id });
        stationPair.push({ s: station.parentStation.id, f: station.id });
      }
      if (station.stationConnected.length) {
        station.stationConnected.forEach((st) => {
          stationPair.push({ s: station.id, f: st.id });
        });
      }
    });
    const res = await this.configService.updateValueByKey(
      STATION_CONNECTED_PATH_KEY,
      JSON.stringify(stationPair),
    );
    return res;
  }

  async getAllConnectedStations(id: number) {
    const res = await this.stationRepository.findOne({
      relations: {
        stationConnected: true,
      },
      where: {
        id,
      },
    });
    return res.stationConnected;
  }
}
