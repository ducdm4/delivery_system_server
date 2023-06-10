import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'addresses' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  cityId: number;

  @Column({ nullable: true })
  districtId: number;

  @Column({ nullable: true })
  wardId: number;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  building: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null, select: false })
  deletedAt: Date;
}
