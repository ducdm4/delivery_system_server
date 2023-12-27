import { DataSource } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';

export const NotificationProviders = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(NotificationEntity),
    inject: ['DATA_SOURCE'],
  },
];
