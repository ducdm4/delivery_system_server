import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity({ name: 'wards' })
export class WardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @OneToOne(() => DistrictEntity)
  @JoinColumn()
  district: DistrictEntity;

  @Column()
  createdAt: Date;
}
