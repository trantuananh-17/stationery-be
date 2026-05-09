import { CustomerSummary } from '../../../domain/entities/customer-summary.entity';

export abstract class ICustomerSummaryCommandRepository {
  abstract create(summary: CustomerSummary): Promise<void>;

  abstract update(summary: CustomerSummary): Promise<void>;

  abstract findByUserId(userId: string): Promise<CustomerSummary | null>;

  abstract upsert(summary: CustomerSummary): Promise<void>;
}
