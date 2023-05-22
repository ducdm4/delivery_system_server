import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { OrderEntity } from './order.entity';
import { StationEntity } from './station.entity';

@Entity({ name: 'order_tracking' })
export class OrderTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @Column()
  status: number;

  @ManyToOne(() => StationEntity)
  stationInCharge: StationEntity;

  @ManyToOne(() => UserEntity)
  collectorInCharge: UserEntity;

  @ManyToOne(() => UserEntity)
  shipperInCharge: UserEntity;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  dropOffAddress: AddressEntity;

  @Column({ type: 'float', nullable: true })
  cashOnDelivery: number;

  @Column({ type: 'float' })
  shippingFare: number;

  @Column({ default: false })
  isCancel: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
