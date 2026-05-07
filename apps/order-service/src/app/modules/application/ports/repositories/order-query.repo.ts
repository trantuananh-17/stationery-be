import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { OrderPaymentDto } from '../../queries/get-order-checkout/get-order-payment.dto';
import { OrderAdminDto } from '../../queries/get-orders-admin/get-orders-admin.dto';
import { Order } from '../../../domain/entities/order.entity';

export abstract class IOrderQueryRepository {
  abstract getPayment(userId: string, orderId: string): Promise<OrderPaymentDto | null>;

  abstract findAll(filters: {
    search?: string;
    status?: OrderStatus;
    // orderBy?: AdminProductOrderBy;
    page: number;
    limit: number;
  }): Promise<QueryResult<OrderAdminDto>>;

  abstract findById(orderId: string): Promise<Order | null>;
}
