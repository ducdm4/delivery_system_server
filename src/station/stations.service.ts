import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { StationEntity } from '../typeorm/entities/station.entity';

@Injectable()
export class StationsService {
  constructor(
    @Inject('STATION_REPOSITORY')
    private stationRepository: Repository<StationEntity>,
  ) {}

  async getListStation(filter) {
    const stationQuery = this.stationRepository.createQueryBuilder('station');
    stationQuery.leftJoin(
      'stations',
      'stationB',
      'station.parentStationId = stationB.id',
    );
    stationQuery.innerJoin(
      'addresses',
      'address',
      'station.addressId = address.id',
    );
    stationQuery.innerJoin('wards', 'ward', 'ward.id = address.wardId');
    stationQuery.innerJoin(
      'districts',
      'district',
      'district.id = address.districtId',
    );
    stationQuery.innerJoin('cities', 'city', 'city.id = address.cityId');
    stationQuery.innerJoin('streets', 'street', 'street.id = address.streetId');
    stationQuery.select([
      'station.*',
      'address.building',
      'address.detail',
      'street.name as streetName',
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
        stationQuery.orderBy(
          `station.${sortItem.key}`,
          sortItem.value.toUpperCase(),
        );
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
    return data;
  }

  async updateStationInfo(data: UpdateStationDto, id: number) {
    const checkStation = await this.getStationById(id);
    if (checkStation) {
      const result = await this.stationRepository.update(
        { id },
        {
          name: data.name,
          type: data.type,
          parentStation: {
            id: data.parentStationId || null,
          },
        },
      );
      return result;
    }
  }

  async deleteStation(id) {
    const checkStation = await this.getStationById(id);
    if (checkStation) {
      const result = await this.stationRepository.softDelete(id);
      return result;
    }
  }
}
