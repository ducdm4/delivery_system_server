import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity({ name: 'stations' })
export class StationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  type: number;

  @Column()
  name: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn({ name: 'addressId', referencedColumnName: 'id' })
  address: AddressEntity;

  @Column({ nullable: true })
  parentStation: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
