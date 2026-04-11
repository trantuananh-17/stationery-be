import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckoutCommand } from './checkout.command';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { ICartGrpcPort } from '../../ports/grpc/cart-grpc.port';

@CommandHandler(CheckoutCommand)
export class CheckoutHandler implements ICommandHandler<CheckoutCommand> {
  constructor(
    private readonly productGrpcPort: IProductGrpcPort,
    private readonly cartGrpcPort: ICartGrpcPort,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: CheckoutCommand): Promise<any> {
    const { userId, shippingAddress, billingAddress, paymentMethod, notes, couponCode } = command;
  }
}
