import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CityEntity } from './city.entity';
import { DistrictEntity } from './district.entity';
import { WardEntity } from './ward.entity';
import { StreetEntity } from './street.entity';

@Entity({ name: 'addresses' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CityEntity)
  @JoinColumn({ name: 'cityId', referencedColumnName: 'id' })
  city: CityEntity;

  @ManyToOne(() => DistrictEntity)
  @JoinColumn({ name: 'districtId', referencedColumnName: 'id' })
  district: DistrictEntity;

  @ManyToOne(() => WardEntity)
  @JoinColumn({ name: 'wardId', referencedColumnName: 'id' })
  ward: WardEntity;

  @ManyToOne(() => StreetEntity)
  @JoinColumn({ name: 'streetId', referencedColumnName: 'id' })
  street: StreetEntity;

  @Column({ nullable: true })
  building: string;

  @Column({ nullable: true })
  detail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
