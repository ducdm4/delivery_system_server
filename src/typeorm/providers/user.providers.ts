import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];
