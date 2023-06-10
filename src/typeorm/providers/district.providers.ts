import { DataSource } from 'typeorm';
import { DistrictEntity } from '../entities/district.entity';

export const DistrictProviders = [
  {
    provide: 'DISTRICT_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(DistrictEntity),
    inject: ['DATA_SOURCE'],
  },
];
