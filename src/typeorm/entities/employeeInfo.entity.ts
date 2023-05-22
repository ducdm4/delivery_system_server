import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
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
  @JoinColumn()
  identityCardImage1: PhotoEntity;

  @OneToOne(() => PhotoEntity)
  @JoinColumn()
  identityCardImage2: PhotoEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => StationEntity)
  @JoinColumn()
  station: StationEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
