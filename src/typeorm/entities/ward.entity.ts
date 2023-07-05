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
import { DistrictEntity } from './district.entity';
import { StationEntity } from './station.entity';

@Entity({ name: 'wards' })
export class WardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @ManyToOne(() => DistrictEntity)
  @JoinColumn({ name: 'districtId', referencedColumnName: 'id' })
  district: DistrictEntity;

  @ManyToOne(() => StationEntity)
  @JoinColumn({ name: 'stationId', referencedColumnName: 'id' })
  station: StationEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
