import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

export const transactionContext = new AsyncLocalStorage<EntityManager>();

export function getManager(): EntityManager | null {
  return transactionContext.getStore() ?? null;
}
