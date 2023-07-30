import { DataSource } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';

export const OrderProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(OrderEntity),
    inject: ['DATA_SOURCE'],
  },
];
