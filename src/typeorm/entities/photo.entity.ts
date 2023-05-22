import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'photos' })
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  createdAt: Date;
}
