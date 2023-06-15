import { DataSource } from 'typeorm';
import { WardEntity } from '../entities/ward.entity';

export const WardProviders = [
  {
    provide: 'WARD_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(WardEntity),
    inject: ['DATA_SOURCE'],
  },
];
