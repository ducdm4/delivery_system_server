import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';
import { PhotoEntity } from './photo.entity';
import { WardEntity } from './ward.entity';

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

  @ManyToOne(
    (type) => StationEntity,
    (stationEntity) => stationEntity.parentStation,
  )
  parentStation: StationEntity;

  @ManyToMany(() => StationEntity, { cascade: true })
  @JoinTable()
  stationConnected: StationEntity[];

  @OneToMany(() => PhotoEntity, (photo) => photo.station, { cascade: true })
  photos: PhotoEntity[];

  @OneToMany(() => WardEntity, (ward) => ward.station, { cascade: true })
  wards: WardEntity[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
