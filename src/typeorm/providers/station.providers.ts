import { DataSource } from 'typeorm';
import { StationEntity } from '../entities/station.entity';

export const StationProviders = [
  {
    provide: 'STATION_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(StationEntity),
    inject: ['DATA_SOURCE'],
  },
];
