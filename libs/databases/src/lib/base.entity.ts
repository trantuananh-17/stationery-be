import { Column, PrimaryColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
