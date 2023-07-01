import { DataSource } from 'typeorm';
import { StreetEntity } from '../entities/street.entity';

export const StreetProviders = [
  {
    provide: 'STREET_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(StreetEntity),
    inject: ['DATA_SOURCE'],
  },
];
