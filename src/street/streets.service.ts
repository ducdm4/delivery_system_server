import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { CreateStreetDto } from './dto/createStreet.dto';
import { UpdateStreetDto } from './dto/updateStreet.dto';
import { StreetEntity } from '../typeorm/entities/street.entity';

@Injectable()
export class StreetsService {
  constructor(
    @Inject('STREET_REPOSITORY')
    private streetRepository: Repository<StreetEntity>,
  ) {}

  async getListStreet(filter) {
    const streetQuery = this.streetRepository.createQueryBuilder('street');
    streetQuery.innerJoin('wards', 'ward', 'street.wardId = ward.id');
    streetQuery.innerJoin(
      'districts',
      'district',
      'ward.districtId = district.id',
    );
    streetQuery.innerJoin('cities', 'city', 'district.cityId = city.id');
    streetQuery.select([
      'street.*',
      'ward.id as wardId',
      'ward.name as wardName',
      'district.id as districtId',
      'district.name as districtName',
      'city.id as cityId',
      'city.name as cityName',
    ]);
    if (filter.keyword) {
      streetQuery.andWhere('street.name LIKE :keyword', {
        keyword: `%${filter.keyword}%`,
      });
    }
    if (filter.filter.length) {
      filter.filter.forEach((filterItem) => {
        if (filterItem.key === 'city') {
          streetQuery.andWhere(`district.cityId = :cid`, {
            cid: filterItem.value,
          });
        } else if (filterItem.key === 'district') {
          streetQuery.andWhere(`ward.districtId = :did`, {
            did: filterItem.value,
          });
        } else {
          streetQuery.andWhere(`street.wardId = :wid`, {
            wid: filterItem.value,
          });
        }
      });
    }
    if (filter.sort.length) {
      filter.sort.forEach((sortItem) => {
        if (sortItem.key === 'city') {
          streetQuery.orderBy(`city.name`, sortItem.value.toUpperCase());
        } else if (sortItem.key === 'district') {
          streetQuery.orderBy(`district.name`, sortItem.value.toUpperCase());
        } else if (sortItem.key === 'ward') {
          streetQuery.orderBy(`ward.name`, sortItem.value.toUpperCase());
        } else {
          streetQuery.orderBy(
            `street.${sortItem.key}`,
            sortItem.value.toUpperCase(),
          );
        }
      });
    }
    const totalStreet = await streetQuery.getCount();
    if (filter.page) {
      streetQuery.offset((filter.page - 1) * filter.limit);
      streetQuery.limit(filter.limit);
    }
    const streetList = await streetQuery.getRawMany();
    return {
      page: filter.page,
      total: totalStreet,
      list: streetList,
    };
  }

  async getStreetById(id: number) {
    const street = await this.streetRepository.findOne({
      relations: {
        ward: {
          district: {
            city: true,
          },
        },
      },
      where: {
        id,
      },
    });
    if (street) {
      return street;
    } else {
      throw new NotFoundException('street not found');
    }
  }

  async createStreet(streetData: CreateStreetDto) {
    const { name, slug, ward } = streetData;
    const newStreet = this.streetRepository.create({
      name,
      slug,
      ward: {
        id: ward.id,
      },
      createdAt: new Date(),
    });
    const data = await this.streetRepository.save(newStreet);
    return data;
  }

  async updateStreetInfo(data: UpdateStreetDto, id: number) {
    const { name, slug, ward } = data;
    const checkStreet = await this.getStreetById(id);
    if (checkStreet) {
      const result = await this.streetRepository.update(
        { id },
        {
          name,
          slug,
          ward: {
            id: ward.id,
          },
        },
      );
      return result;
    }
  }

  async deleteStreet(id) {
    const checkStreet = await this.getStreetById(id);
    if (checkStreet) {
      const result = await this.streetRepository.softDelete(id);
      return result;
    }
  }
}
