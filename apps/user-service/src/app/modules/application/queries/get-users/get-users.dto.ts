import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export interface UserDto {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  // address: string;
  totalOrder: number;
  totalPrice: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface UserGrpcDto {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  // address: string;
  totalOrder: number;
  totalPrice: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: GrpcTimestamp;
}
