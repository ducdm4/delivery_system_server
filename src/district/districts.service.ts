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
    // const selectOption: { [key: string]: any } = {
    //   relations: {
    //     city: true,
    //   },
    //   where: {
    //     name: Like(`%${filter.keyword}%`),
    //   },
    // };
    // const orderObject: { [key: string]: string | object } = {};
    // if (filter.sort.length) {
    //   filter.sort.forEach((sortItem) => {
    //     if (sortItem.key === 'city') {
    //       orderObject[sortItem.key] = {
    //         name: sortItem.value.toUpperCase(),
    //       };
    //     }
    //     orderObject[sortItem.key] = sortItem.value.toUpperCase();
    //   });
    //   selectOption.order = orderObject;
    // }
    // const totalDistrict = await this.districtRepository.count(selectOption);
    // if (filter.page) {
    //   selectOption.skip = (filter.page - 1) * filter.limit;
    //   selectOption.take = filter.limit;
    // }
    // const districtList = await this.districtRepository.find(selectOption);
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
        districtQuery.where('city.id = :id', { id: filterItem.value });
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
    console.log('districtQuery', districtQuery.getSql());
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
      console.log('ducdm', result);
      return result;
    }
  }

  async deleteDistrict(id) {
    const checkDistrict = await this.getDistrictById(id);
    if (checkDistrict) {
      const result = await this.districtRepository.softDelete(id);
      console.log('ducdm', result);
      return result;
    }
  }
}
