import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { ParcelEntity } from './parcel.entity';

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

  @Column()
  senderEmail: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  pickupAddress: AddressEntity;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column()
  receiverEmail: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  dropOffAddress: AddressEntity;

  @Column({ type: 'float', nullable: true, default: 0 })
  cashOnDelivery: number;

  @Column({ type: 'float', default: 0 })
  shippingFare: number;

  @Column({ default: 0 })
  numberOfAtTemp: number;

  @Column({ default: 0 })
  attempToPickup: number;

  @Column({ default: false })
  isCancel: boolean;

  @Column({ default: false })
  isRecipientPayingFare: boolean;

  @OneToMany(() => ParcelEntity, (parcel) => parcel.order, { cascade: true })
  parcels: ParcelEntity[];

  @Column()
  stationRoutine: string;

  @Column()
  isCancelNote: string;

  @Column({ default: null })
  notificationToken: string;

  @Column({ default: null })
  cancelOTP: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
