import { DataSource } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employeeInfo.entity';

export const EmployeeProviders = [
  {
    provide: 'EMPLOYEE_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(EmployeeInfoEntity),
    inject: ['DATA_SOURCE'],
  },
];
