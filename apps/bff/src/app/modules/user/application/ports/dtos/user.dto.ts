import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
export interface WishlistItemDto {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
}

export interface WishlistResponse {
  data: WishlistItemDto[];
}

export interface AddWishlistItemRequest {
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
}

export interface RemoveWishlistItemRequest {
  userId: string;
  productId: string;
}

export interface WishlistActionResponse {
  productId: string;
  added: boolean;
}

export interface AddressResponseDto {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  createdAt: GrpcTimestamp;
}

export interface AddressesResponse {
  data: AddressResponseDto[];
}

export interface AddressResponse {
  data: AddressResponseDto;
}

export interface AddressIdResponse {
  addressId: string;
}

export interface AddressInputRequest {
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface CreateAddressRequest extends AddressInputRequest {
  userId: string;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  addressId: string;
}

export interface AddressActionRequest {
  userId: string;
  addressId: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface UserResponse {
  userId: string;
}

export interface UserAuthResponse {
  userId: string;
  role: string;
  permissions: string[];
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

export interface GetUsersRequest {
  search?: string;
  orderBy?: string;
  page?: number;
  limit?: number;
}

export interface UserGrpcDto {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  totalOrder: number;
  totalPrice: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: GrpcTimestamp;
}

export interface UsersResponse {
  data: UserGrpcDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LastOrderItemGrpcDto {
  productId: string;
  variantId?: string;
  name: string;
  thumbnail?: string;
  quantity: number;
  subtotal: number;
}

export interface LastOrderGrpcDto {
  orderId: string;
  orderNumber: string;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  orderedAt: GrpcTimestamp;
  items: LastOrderItemGrpcDto[];
}

export interface UserAdminDetailResponse {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: GrpcTimestamp;
  isVerified: boolean;
  isActive: boolean;
  totalOrders: number;
  amountSpent: number;
  customerSince?: GrpcTimestamp;
  lastOrder?: LastOrderGrpcDto;
  createdAt: GrpcTimestamp;
}
