import { DataSource } from 'typeorm';
import { CityEntity } from '../entities/city.entity';

export const CityProviders = [
  {
    provide: 'CITY_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(CityEntity),
    inject: ['DATA_SOURCE'],
  },
];
