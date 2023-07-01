import { DataSource } from 'typeorm';
import { AddressEntity } from '../entities/address.entity';

export const AddressProviders = [
  {
    provide: 'ADDRESS_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(AddressEntity),
    inject: ['DATA_SOURCE'],
  },
];
