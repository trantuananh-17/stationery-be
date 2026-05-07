import { Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}

export abstract class BaseProcessedEvent {
  @PrimaryColumn()
  eventId: string;

  @Column()
  eventType: string;

  @CreateDateColumn()
  createdAt: Date;
}
