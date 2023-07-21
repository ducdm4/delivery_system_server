import { DataSource } from 'typeorm';
import { RouteEntity } from '../entities/route.entity';

export const RouteProviders = [
  {
    provide: 'ROUTE_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(RouteEntity),
    inject: ['DATA_SOURCE'],
  },
];
