import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PhotoEntity } from './photo.entity';
import { AddressEntity } from './address.entity';

@Entity({ name: 'user_info' })
export class UserInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => AddressEntity)
  @JoinColumn()
  address: AddressEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
