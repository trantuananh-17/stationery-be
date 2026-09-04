import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReviewNotFoundError } from '../../../../domain/errors/product.error';
import { IReviewCommandRepository } from '../../../ports/repositories/review-command.repo';
import { DeleteReviewCommand } from './delete-review.command';

@CommandHandler(DeleteReviewCommand)
export class DeleteReviewHandler implements ICommandHandler<DeleteReviewCommand> {
  constructor(private readonly reviewRepo: IReviewCommandRepository) {}

  async execute(command: DeleteReviewCommand) {
    const { productId, userId } = command;

    const deleted = await this.reviewRepo.delete(productId, userId);

    if (!deleted) {
      throw new ReviewNotFoundError();
    }

    return { productId };
  }
}
