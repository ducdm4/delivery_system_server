import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'configs' })
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
