import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
