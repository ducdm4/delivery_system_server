import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
