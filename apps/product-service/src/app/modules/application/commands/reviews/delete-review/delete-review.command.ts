import { ICommand } from '@nestjs/cqrs';

export class DeleteReviewCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
  ) {}
}
