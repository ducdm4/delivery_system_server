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

  @Column({ default: 1 })
  role: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true, type: 'date' })
  dob: string;

  @Column({ default: true })
  gender: boolean;

  @Column({ nullable: true })
  phone: string;

  @OneToOne(() => PhotoEntity)
  @JoinColumn({ name: 'profilePictureId', referencedColumnName: 'id' })
  profilePicture: PhotoEntity;

  @OneToOne(() => AddressEntity)
  @JoinColumn({ name: 'addressId', referencedColumnName: 'id' })
  address: AddressEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
