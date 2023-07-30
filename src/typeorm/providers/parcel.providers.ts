import { DataSource } from 'typeorm';
import { ParcelEntity } from '../entities/parcel.entity';

export const ParcelProviders = [
  {
    provide: 'PARCEL_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(ParcelEntity),
    inject: ['DATA_SOURCE'],
  },
];
