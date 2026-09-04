import { ICommand } from '@nestjs/cqrs';

export class CreateReviewCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly rating: number,
    public readonly comment: string,
  ) {}
}
