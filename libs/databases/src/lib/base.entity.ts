import { Column, PrimaryColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
