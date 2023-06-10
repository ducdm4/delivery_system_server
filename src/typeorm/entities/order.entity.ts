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

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uniqueTrackingId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  senderName: string;

  @Column()
  senderPhone: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  pickupAddress: AddressEntity;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  dropOffAddress: AddressEntity;

  @Column({ type: 'float', nullable: true })
  cashOnDelivery: number;

  @Column({ type: 'float' })
  shippingFare: number;

  @Column()
  numberOfAtTemp: number;

  @Column({ default: false })
  isCancel: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
