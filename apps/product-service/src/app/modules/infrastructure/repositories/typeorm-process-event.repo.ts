import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryProcessedEventEntity } from '../entities/typeorm-process-event.entity';
import { IProcessedEventRepository } from '../../application/ports/repositories/process-event.repo';

@Injectable()
export class TypeOrmProcessedEventRepository implements IProcessedEventRepository {
  constructor(
    @InjectRepository(InventoryProcessedEventEntity)
    private readonly repo: Repository<InventoryProcessedEventEntity>,
  ) {}

  async tryInsert(eventId: string, eventType: string): Promise<boolean> {
    const result = await this.repo
      .createQueryBuilder()
      .insert()
      .into(InventoryProcessedEventEntity)
      .values({ eventId, eventType })
      .orIgnore()
      .execute();

    return result.identifiers.length > 0;
  }
}
