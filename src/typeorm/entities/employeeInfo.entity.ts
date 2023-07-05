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
import { UserEntity } from './user.entity';
import { PhotoEntity } from './photo.entity';
import { StationEntity } from './station.entity';

@Entity({ name: 'employee_info' })
export class EmployeeInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isActive: boolean;

  @OneToOne(() => PhotoEntity)
  @JoinColumn({ name: 'identityCardImage1Id', referencedColumnName: 'id' })
  identityCardImage1: PhotoEntity;

  @OneToOne(() => PhotoEntity)
  @JoinColumn({ name: 'identityCardImage2Id', referencedColumnName: 'id' })
  identityCardImage2: PhotoEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToOne(() => StationEntity)
  @JoinColumn({ name: 'stationId', referencedColumnName: 'id' })
  station: StationEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
