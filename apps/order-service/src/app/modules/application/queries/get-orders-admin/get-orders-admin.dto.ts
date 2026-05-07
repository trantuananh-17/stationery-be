import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export interface OrderAdminDto {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
}

export interface OrderAdminGrpcDto {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: GrpcTimestamp;
}
