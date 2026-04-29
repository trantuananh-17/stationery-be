import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckoutCommand } from './checkout.command';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { ICartGrpcPort } from '../../ports/grpc/cart-grpc.port';
import { Order } from '../../../domain/entities/order.entity';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';

@CommandHandler(CheckoutCommand)
export class CheckoutHandler implements ICommandHandler<CheckoutCommand> {
  constructor(
    private readonly productGrpcPort: IProductGrpcPort,
    private readonly cartGrpcPort: ICartGrpcPort,
    private readonly dataContext: IUnitOfWork,
    private readonly orderCommandRepo: IOrderCommandRepository,
  ) {}

  async execute(command: CheckoutCommand): Promise<any> {
    const { userId, shippingAddress, billingAddress, paymentMethod, notes } = command;

    const cart = await this.cartGrpcPort.getCartForCheckout({ userId });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const reservedStock = await this.productGrpcPort.reserveStock({
      items: cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    if (reservedStock.success === false) {
      throw new Error('Failed to reserve stock for one or more items');
    }

    const number = this.generateOrderNumber();

    const discount = 0;

    const order = Order.create({
      userId,
      number,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      discount,
      items: cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: `${item.productNameSnapshot} ${item.variantNameSnapshot}`.trim(),
        sku: item.skuSnapshot,
        price: item.unitPriceSnapshot,
        quantity: item.quantity,
        image: item.productThumbnailSnapshot,
        attributes: item.attributesSnapshot,
      })),
    });

    await this.dataContext.runInTransaction(async () => {
      await this.orderCommandRepo.save(order);
    });

    return {
      orderId: order.id,
      orderNumber: order.number,
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
    };
  }

  private generateOrderNumber(): string {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const random = Math.floor(10000000 + Math.random() * 90000000);

    return `ORD-${yyyy}${mm}${dd}-${random}`;
  }
}
