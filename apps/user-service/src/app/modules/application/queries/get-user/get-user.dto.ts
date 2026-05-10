import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
import { Gender } from '../../../domain/enums/gender.enum';

export interface UserAdminDetailDto {
  id: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phone?: string;

  avatar?: string;

  gender?: Gender;
  dateOfBirth?: Date;

  isVerified: boolean;
  isActive: boolean;

  totalOrders: number;
  amountSpent: number;

  customerSince: Date;

  lastOrder?: {
    orderId: string;
    orderNumber: string;

    totalPrice: number;

    orderStatus: string;
    paymentStatus: string;

    orderedAt: Date;

    items: {
      productId: string;
      variantId?: string;

      name: string;
      thumbnail?: string;

      quantity: number;
      subtotal: number;
    }[];
  };

  createdAt: Date;
}

export interface UserAdminDetailGrpcDto {
  id: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phone?: string;

  avatar?: string;

  gender?: Gender;
  dateOfBirth?: GrpcTimestamp;

  isVerified: boolean;
  isActive: boolean;

  totalOrders: number;
  amountSpent: number;

  customerSince: GrpcTimestamp;

  lastOrder?: {
    orderId: string;
    orderNumber: string;

    totalPrice: number;

    orderStatus: string;
    paymentStatus: string;

    orderedAt: GrpcTimestamp;

    items: {
      productId: string;
      variantId?: string;

      name: string;
      thumbnail?: string;

      quantity: number;
      subtotal: number;
    }[];
  };

  createdAt: GrpcTimestamp;
}
