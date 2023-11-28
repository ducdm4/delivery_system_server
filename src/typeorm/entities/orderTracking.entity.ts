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
import { OrderEntity } from './order.entity';
import { StationEntity } from './station.entity';
import { PhotoEntity } from './photo.entity';

@Entity({ name: 'order_tracking' })
export class OrderTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @Column()
  status: number;

  @Column({ nullable: true })
  proofNote: string;

  @ManyToOne(() => StationEntity)
  stationInCharge: StationEntity;

  @ManyToOne(() => StationEntity)
  previousStationInCharge: StationEntity;

  @ManyToOne(() => UserEntity)
  collectorInCharge: UserEntity;

  @ManyToOne(() => UserEntity)
  shipperInCharge: UserEntity;

  @OneToOne(() => PhotoEntity)
  @JoinColumn()
  proof: PhotoEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
