import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  userId: UserEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
