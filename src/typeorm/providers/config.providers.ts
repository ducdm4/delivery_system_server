import { DataSource } from 'typeorm';
import { ConfigEntity } from '../entities/config.entity';

export const ConfigProviders = [
  {
    provide: 'CONFIG_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(ConfigEntity),
    inject: ['DATA_SOURCE'],
  },
];
