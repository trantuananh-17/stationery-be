import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckoutCommand } from './checkout.command';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { ICartGrpcPort } from '../../ports/grpc/cart-grpc.port';
import { Order } from '../../../domain/entities/order.entity';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';

export type CheckoutStockItem = {
  variantId: string;
  quantity: number;
  success: boolean;
  status: 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';
  availableStock: number;
  remainingStock: number;
  message?: string;
};

export type CheckoutResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
      subtotal: number;
      total: number;
      status: string;
      paymentStatus: string;
      stockItems: CheckoutStockItem[];
    }
  | {
      success: false;
      code: 'CART_EMPTY' | 'STOCK_RESERVATION_FAILED';
      message: string;
      stockItems: CheckoutStockItem[];
    };

@CommandHandler(CheckoutCommand)
export class CheckoutHandler implements ICommandHandler<CheckoutCommand, CheckoutResult> {
  constructor(
    private readonly productGrpcPort: IProductGrpcPort,
    private readonly cartGrpcPort: ICartGrpcPort,
    private readonly dataContext: IUnitOfWork,
    private readonly orderCommandRepo: IOrderCommandRepository,
  ) {}

  async execute(command: CheckoutCommand): Promise<CheckoutResult> {
    const { userId, email, shippingAddress, billingAddress, paymentMethod, notes } = command;

    const cart = await this.cartGrpcPort.getCartForCheckout({ userId });

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        code: 'CART_EMPTY',
        message: 'Giỏ hàng trống',
        stockItems: [],
      };
    }

    const reservedStock = await this.productGrpcPort.reserveStock({
      items: cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    if (!reservedStock.success) {
      return {
        success: false,
        code: 'STOCK_RESERVATION_FAILED',
        message: 'Một số sản phẩm không đủ điều kiện để đặt hàng',
        stockItems: reservedStock.items,
      };
    }

    const number = this.generateOrderNumber();

    const order = Order.create({
      userId,
      email,
      number,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      discount: 0,
      items: cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: `${item.productNameSnapshot} ${item.variantNameSnapshot}`.trim(),
        sku: item.skuSnapshot,
        price: item.unitPriceSnapshot,
        quantity: item.quantity,
        image: item.imageVariantSnapshot || item.productThumbnailSnapshot,
        attributes: item.attributesSnapshot,
      })),
    });

    await this.dataContext.runInTransaction(async () => {
      await this.orderCommandRepo.save(order);
    });

    // Sau khi save order thành công thì mới clear cart
    // await this.cartGrpcPort.clearCartItems({
    //   userId,
    //   variantIds: cart.items.map((item) => item.variantId),
    // });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      stockItems: reservedStock.items,
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
