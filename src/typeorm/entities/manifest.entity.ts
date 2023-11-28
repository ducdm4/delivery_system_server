import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeInfoEntity } from './employeeInfo.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'manifests' })
export class ManifestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isComplete: boolean;

  @ManyToOne(() => EmployeeInfoEntity)
  @JoinColumn()
  employee: EmployeeInfoEntity;

  @Column()
  type: number; // 0 is pickup, 1 is drop

  @ManyToMany(() => OrderEntity, { cascade: true })
  @JoinTable()
  orders: OrderEntity[];

  @ManyToMany(() => OrderEntity, { cascade: true })
  @JoinTable()
  orderProcessed: OrderEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
