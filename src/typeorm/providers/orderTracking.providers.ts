import { DataSource } from 'typeorm';
import { OrderTrackingEntity } from '../entities/orderTracking.entity';

export const OrderTrackingProviders = [
  {
    provide: 'ORDER_TRACKING_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(OrderTrackingEntity),
    inject: ['DATA_SOURCE'],
  },
];
