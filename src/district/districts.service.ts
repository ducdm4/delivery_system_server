import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { DistrictEntity } from '../typeorm/entities/district.entity';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import { UpdateDistrictDto } from './dto/updateDistrict.dto';

@Injectable()
export class DistrictsService {
  constructor(
    @Inject('DISTRICT_REPOSITORY')
    private districtRepository: Repository<DistrictEntity>,
  ) {}

  async getListDistrict(filter) {
    const districtQuery =
      this.districtRepository.createQueryBuilder('district');
    districtQuery.innerJoin('cities', 'city', 'district.cityId = city.id');
    districtQuery.select([
      'district.*',
      'city.id as cityId',
      'city.name as cityName',
    ]);
    if (filter.keyword) {
      districtQuery.where('district.name LIKE :keyword', {
        keyword: `%${filter.keyword}%`,
      });
    }
    if (filter.filter.length) {
      filter.filter.forEach((filterItem) => {
        districtQuery.andWhere('city.id = :id', { id: filterItem.value });
      });
    }
    if (filter.sort.length) {
      filter.sort.forEach((sortItem) => {
        if (sortItem.key === 'city') {
          districtQuery.orderBy(`city.name`, sortItem.value.toUpperCase());
        } else {
          districtQuery.orderBy(
            `district.${sortItem.key}`,
            sortItem.value.toUpperCase(),
          );
        }
      });
    }
    const totalDistrict = await districtQuery.getCount();
    if (filter.page) {
      districtQuery.offset((filter.page - 1) * filter.limit);
      districtQuery.limit(filter.limit);
    }
    const districtList = await districtQuery.getRawMany();
    return {
      page: filter.page,
      total: totalDistrict,
      list: districtList,
    };
  }

  async getDistrictById(id: number) {
    const district = await this.districtRepository.findOne({
      relations: {
        city: true,
      },
      where: {
        id,
      },
    });
    if (district) {
      return district;
    } else {
      throw new NotFoundException('district not found');
    }
  }

  async createDistrict(districtData: CreateDistrictDto) {
    const { name, slug, city } = districtData;
    const newDistrict = this.districtRepository.create({
      name,
      slug,
      city: {
        id: city.id,
      },
      createdAt: new Date(),
    });
    const data = await this.districtRepository.save(newDistrict);
    return data;
  }

  async updateDistrictInfo(data: UpdateDistrictDto, id: number) {
    const { name, slug, city } = data;
    const checkDistrict = await this.getDistrictById(id);
    if (checkDistrict) {
      const result = await this.districtRepository.update(
        { id },
        {
          name,
          slug,
          city: {
            id: city.id,
          },
        },
      );
      return result;
    }
  }

  async deleteDistrict(id) {
    const checkDistrict = await this.getDistrictById(id);
    if (checkDistrict) {
      const result = await this.districtRepository.softDelete(id);
      return result;
    }
  }
}
