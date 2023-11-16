import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { EmployeeInfoEntity } from '../typeorm/entities/employeeInfo.entity';
import {
  CreateEmployeeAdd,
  UploadedEditEmployeeDataDto,
} from './dto/employees.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('EMPLOYEE_REPOSITORY')
    private employeeRepository: Repository<EmployeeInfoEntity>,
  ) {}

  async getListEmployee(filter) {
    const employeeQuery =
      this.employeeRepository.createQueryBuilder('employee');
    employeeQuery.innerJoin('users', 'user', 'employee.userId = user.id');
    employeeQuery.innerJoin(
      'stations',
      'station',
      'employee.stationId = station.id',
    );
    employeeQuery.select([
      'employee.*',
      'station.name as stationName',
      'user.role as role',
      'user.firstName as firstName',
      'user.lastName as lastName',
    ]);
    if (filter.keyword) {
      employeeQuery.where('user.firstName LIKE :keywordFirst', {
        keywordFirst: `%${filter.keyword}%`,
      });
      employeeQuery.andWhere('user.lastName LIKE :keywordLast', {
        keywordLast: `%${filter.keyword}%`,
      });
    }
    if (filter.filter.length) {
      filter.filter.forEach((filterItem) => {
        if (filterItem.key === 'station') {
          employeeQuery.andWhere('station.id = :id', { id: filterItem.value });
        } else if (filterItem.key === 'role') {
          employeeQuery.andWhere('user.role = :role', {
            role: filterItem.value,
          });
        } else if (filterItem.key === 'isVerified') {
          employeeQuery.andWhere('employee.isVerified = :isVerified', {
            isVerified: filterItem.value,
          });
        }
      });
    }
    if (filter.sort.length) {
      filter.sort.forEach((sortItem) => {
        if (sortItem.key === 'name') {
          employeeQuery.orderBy(`user.firstName`, sortItem.value.toUpperCase());
          employeeQuery.orderBy(`user.lastName`, sortItem.value.toUpperCase());
        }
      });
    }
    const totalDistrict = await employeeQuery.getCount();
    if (filter.page) {
      employeeQuery.offset((filter.page - 1) * filter.limit);
      employeeQuery.limit(filter.limit);
    }
    const districtList = await employeeQuery.getRawMany();
    return {
      page: filter.page,
      total: totalDistrict,
      list: districtList,
    };
  }

  async getEmployeeById(id: number) {
    const employee = await this.employeeRepository.findOne({
      relations: {
        user: {
          address: {
            city: true,
            ward: true,
            street: true,
            district: true,
          },
        },
        station: true,
        identityCardImage1: true,
        identityCardImage2: true,
      },
      where: {
        id,
      },
    });
    if (employee) {
      return employee;
    } else {
      throw new NotFoundException('employee not found');
    }
  }

  async getEmployeeByUserId(id: number) {
    const employee = await this.employeeRepository.findOne({
      relations: {
        station: true,
      },
      where: {
        user: {
          id,
        },
      },
    });
    if (employee) {
      return employee;
    } else {
      throw new NotFoundException('employee not found');
    }
  }

  async createEmployee(employeeData: CreateEmployeeAdd) {
    const newEmployee = this.employeeRepository.create({
      ...employeeData,
    });
    const data = await this.employeeRepository.save(newEmployee);
    return data;
  }

  async updateEmployeeInfo(
    data:
      | UploadedEditEmployeeDataDto
      | { isVerified?: boolean; isActive?: boolean },
    id: number,
  ) {
    const checkEmployee = await this.getEmployeeById(id);
    if (checkEmployee) {
      const result = await this.employeeRepository.update(
        { id },
        {
          ...data,
        },
      );
      return result;
    }
  }

  async deleteEmployee(id) {
    const checkEmployee = await this.getEmployeeById(id);
    if (checkEmployee) {
      const result = await this.employeeRepository.softDelete(id);
      return result;
    }
  }
}
