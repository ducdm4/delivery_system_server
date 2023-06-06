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
import { PhotoEntity } from './photo.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'parcels' })
export class ParcelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @Column()
  name: string;

  @Column({ type: 'float' })
  weight: number;

  @OneToOne(() => PhotoEntity)
  @JoinColumn()
  photo: PhotoEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;
}
