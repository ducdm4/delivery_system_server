import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
