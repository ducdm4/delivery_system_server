import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, IsNull, Like, Repository } from 'typeorm';
import { CreateWardDto } from './dto/createWard.dto';
import { UpdateWardDto } from './dto/updateWard.dto';
import { WardEntity } from '../typeorm/entities/ward.entity';

@Injectable()
export class WardsService {
  constructor(
    @Inject('WARD_REPOSITORY')
    private wardRepository: Repository<WardEntity>,
  ) {}

  async getListWard(filter) {
    const wardQuery = this.wardRepository.createQueryBuilder('ward');
    wardQuery.innerJoin(
      'districts',
      'district',
      'ward.districtId = district.id',
    );
    wardQuery.innerJoin('cities', 'city', 'district.cityId = city.id');
    wardQuery.select([
      'ward.*',
      'district.id as districtId',
      'district.name as districtName',
      'city.id as cityId',
      'city.name as cityName',
    ]);
    if (filter.keyword) {
      wardQuery.andWhere('ward.name LIKE :keyword', {
        keyword: `%${filter.keyword}%`,
      });
    }
    if (filter.filter.length) {
      filter.filter.forEach((filterItem) => {
        if (filterItem.key === 'city') {
          wardQuery.andWhere(`district.cityId = :cid`, {
            cid: filterItem.value,
          });
        } else {
          wardQuery.andWhere(`ward.districtId = :did`, {
            did: filterItem.value,
          });
        }
      });
    }
    if (filter.sort.length) {
      filter.sort.forEach((sortItem) => {
        if (sortItem.key === 'city') {
          wardQuery.orderBy(`city.name`, sortItem.value.toUpperCase());
        } else if (sortItem.key === 'district') {
          wardQuery.orderBy(`district.name`, sortItem.value.toUpperCase());
        } else {
          wardQuery.orderBy(
            `ward.${sortItem.key}`,
            sortItem.value.toUpperCase(),
          );
        }
      });
    }
    const totalWard = await wardQuery.getCount();
    if (filter.page) {
      wardQuery.offset((filter.page - 1) * filter.limit);
      wardQuery.limit(filter.limit);
    }
    const wardList = await wardQuery.getRawMany();
    return {
      page: filter.page,
      total: totalWard,
      list: wardList,
    };
  }

  async getWardById(id: number) {
    const ward = await this.wardRepository.findOne({
      relations: {
        district: {
          city: true,
        },
      },
      where: {
        id,
      },
    });
    if (ward) {
      return ward;
    } else {
      throw new NotFoundException('ward not found');
    }
  }

  async createWard(wardData: CreateWardDto) {
    const { name, slug, district } = wardData;
    const newWard = this.wardRepository.create({
      name,
      slug,
      district: {
        id: district.id,
      },
      createdAt: new Date(),
    });
    const data = await this.wardRepository.save(newWard);
    return data;
  }

  async updateWardInfo(data: UpdateWardDto, id: number) {
    const { name, slug, district } = data;
    const checkWard = await this.getWardById(id);
    if (checkWard) {
      const result = await this.wardRepository.update(
        { id },
        {
          name,
          slug,
          district: {
            id: district.id,
          },
        },
      );
      return result;
    }
  }

  async updateWardStation(stationId: number, ids: Array<number>) {
    const result = await this.wardRepository.update(
      {
        id: In(ids),
      },
      {
        station: {
          id: stationId,
        },
      },
    );
    return result;
  }

  async deleteWard(id) {
    const checkWard = await this.getWardById(id);
    if (checkWard) {
      const result = await this.wardRepository.softDelete(id);
      return result;
    }
  }

  async getWardNotUnderManage(id) {
    const wardList = await this.wardRepository.findBy({
      station: IsNull(),
      district: {
        id,
      },
    });
    return wardList;
  }

  async getWardUnderManage(id) {
    const wardList = await this.wardRepository.findBy({
      station: {
        id,
      },
    });

    return wardList;
  }
}
