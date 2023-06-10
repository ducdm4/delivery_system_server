import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeInfoEntity } from './employeeInfo.entity';
import { WardEntity } from './ward.entity';

@Entity({ name: 'routes' })
export class RouteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @OneToOne(() => EmployeeInfoEntity)
  @JoinColumn()
  employee: EmployeeInfoEntity;

  @Column({ nullable: true })
  isGoToParent: boolean;

  @ManyToMany(() => WardEntity)
  @JoinTable()
  wards: WardEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
