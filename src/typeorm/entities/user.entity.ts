import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PhotoEntity } from './photo.entity';
import { AddressEntity } from './address.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Exclude()
  @Column({ nullable: true, select: false })
  refreshToken: string;

  @Column({ default: 1 })
  role: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dob: string;

  @Column()
  gender: boolean;

  @Column({ nullable: true })
  phone: string;

  @OneToOne(() => PhotoEntity)
  @JoinColumn()
  profilePicture: PhotoEntity;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  address: AddressEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
