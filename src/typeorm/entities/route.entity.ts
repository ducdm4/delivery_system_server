import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeInfoEntity } from './employeeInfo.entity';
import { StreetEntity } from './street.entity';
import { StationEntity } from './station.entity';

@Entity({ name: 'routes' })
export class RouteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @ManyToOne(() => EmployeeInfoEntity)
  @JoinColumn()
  employee: EmployeeInfoEntity;

  @ManyToOne(() => StationEntity)
  @JoinColumn({ name: 'stationId', referencedColumnName: 'id' })
  station: StationEntity;

  @Column({ nullable: true })
  isGoToParent: boolean;

  @ManyToMany(() => StreetEntity, { cascade: true })
  @JoinTable()
  streets: StreetEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
