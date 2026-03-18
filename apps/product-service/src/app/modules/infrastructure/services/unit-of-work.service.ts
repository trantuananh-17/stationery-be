import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IUnitOfWork } from '../../application/ports/services/unit-of-work.port';
import { transactionContext } from '../helpers/get-manager.helper';

@Injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      return transactionContext.run(manager, work);
    });
  }
}
