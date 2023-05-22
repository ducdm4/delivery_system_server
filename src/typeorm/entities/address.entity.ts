import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
