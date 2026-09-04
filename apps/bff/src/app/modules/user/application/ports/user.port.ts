import {
  AddWishlistItemRequest,
  RemoveWishlistItemRequest,
  WishlistActionResponse,
  WishlistResponse,
  AddressActionRequest,
  AddressesResponse,
  AddressIdResponse,
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
  CreateUserRequest,
  UserAuthResponse,
  UserResponse,
  UsersResponse,
  UserAdminDetailResponse,
} from './dtos/user.dto';

export abstract class UserPort {
  abstract createUser(data: CreateUserRequest): Promise<UserResponse>;

  abstract getUserAuth(data: { userId: string }): Promise<UserAuthResponse>;

  abstract getUsers(data: {
    search?: string;
    orderBy?: string;

    page?: number;
    limit?: number;
  }): Promise<UsersResponse>;

  abstract getUser(data: { userId: string }): Promise<UserAdminDetailResponse>;

  abstract getAddresses(data: { userId: string }): Promise<AddressesResponse>;

  abstract createAddress(data: CreateAddressRequest): Promise<AddressResponse>;

  abstract updateAddress(data: UpdateAddressRequest): Promise<AddressResponse>;

  abstract deleteAddress(data: AddressActionRequest): Promise<AddressIdResponse>;

  abstract setDefaultAddress(data: AddressActionRequest): Promise<AddressResponse>;

  abstract getWishlist(data: { userId: string }): Promise<WishlistResponse>;

  abstract addWishlistItem(data: AddWishlistItemRequest): Promise<WishlistActionResponse>;

  abstract removeWishlistItem(data: RemoveWishlistItemRequest): Promise<WishlistActionResponse>;
}
