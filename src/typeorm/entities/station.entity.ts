import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity({ name: 'stations' })
export class StationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  type: number;

  @Column()
  name: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  address: AddressEntity;

  @Column({ nullable: true })
  parentStation: number;

  @Column({ nullable: true })
  wardList: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
