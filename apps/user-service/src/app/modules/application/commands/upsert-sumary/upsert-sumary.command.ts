import { ICommand } from '@nestjs/cqrs';

export class UpsertSummaryCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly isActive?: boolean,
    public readonly isVerified?: boolean,
    public readonly totalOrdersIncrement?: number,
    public readonly amountSpentIncrement?: number,
    public readonly lastOrderId?: string,
    public readonly lastOrderTotal?: number,
    public readonly lastOrderAt?: Date,
  ) {}
}
