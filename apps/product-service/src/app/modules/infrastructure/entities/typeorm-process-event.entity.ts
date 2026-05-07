import { BaseProcessedEvent } from '@common/databases/base.entity';
import { Entity } from 'typeorm';

@Entity('inventory_processed_events')
export class InventoryProcessedEventEntity extends BaseProcessedEvent {}
