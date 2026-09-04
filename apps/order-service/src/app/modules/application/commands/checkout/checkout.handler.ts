import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckoutCommand } from './checkout.command';
import { ICouponRepository } from '../../ports/repositories/coupon.repo';
import { CouponNotFoundError, CouponUsageLimitError } from '../../../domain/errors/coupon.error';
import { calculateShippingFee } from '../../../domain/services/shipping-policy';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { ICartGrpcPort } from '../../ports/grpc/cart-grpc.port';
import { Order } from '../../../domain/entities/order.entity';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';
import { IEventPublisher } from '../../ports/producers/event-publisher.port';

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
    private readonly eventPublisher: IEventPublisher,
    private readonly couponRepo: ICouponRepository,
  ) {}

  async execute(command: CheckoutCommand): Promise<CheckoutResult> {
    const { userId, email, shippingAddress, billingAddress, paymentMethod, notes, couponCode } =
      command;

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

    const subtotal = cart.items.reduce(
      (total, item) => total + item.unitPriceSnapshot * item.quantity,
      0,
    );

    // Áp mã giảm giá trên tổng tiền hàng, trước khi tạo đơn.
    let discount = 0;

    if (couponCode?.trim()) {
      const coupon = await this.couponRepo.findByCode(couponCode);

      if (!coupon) {
        throw new CouponNotFoundError(couponCode);
      }

      coupon.assertUsableFor(subtotal);

      // Giữ lượt dùng ngay tại đây: điều kiện usage_limit nằm trong câu UPDATE nên
      // hai đơn đặt cùng lúc không thể cùng tiêu lượt cuối cùng.
      const reserved = await this.couponRepo.incrementUsage(coupon.id);

      if (!reserved) {
        throw new CouponUsageLimitError();
      }

      discount = coupon.calculateDiscount(subtotal);
    }

    const shippingCost = calculateShippingFee(subtotal - discount);

    const number = this.generateOrderNumber();

    const order = Order.create({
      userId,
      email,
      number,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      discount,
      shippingCost,
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

    await this.cartGrpcPort.checkoutCart({
      userId,
    });

    await this.eventPublisher.emitOrderCreated({
      eventId: crypto.randomUUID(),
      orderId: order.id,
      customerId: order.userId,
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      totalAmount: order.total,
      totalItems: order.totalItems,

      createdAt: new Date().toISOString(),
    });

    await this.eventPublisher.emitNotificationOrderCreated({
      eventId: crypto.randomUUID(),
      receiverId: 'e6d14eb9-268c-4a74-88b0-4b0d9731443b',
      type: 'ORDER_CREATED',
      title: 'Có đơn hàng mới',
      message: `Đơn hàng ${order.number} vừa được tạo bởi ${shippingAddress.firstName} ${shippingAddress.lastName}`,
      metadata: {
        orderId: order.id,
        orderNumber: order.number,
        customerId: order.userId,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        totalAmount: order.total,
        totalItems: order.totalItems,
      },

      createdAt: new Date().toISOString(),
    });

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
