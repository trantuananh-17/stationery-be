import { Observable } from 'rxjs';

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
  GetUsersRequest,
  UserAdminDetailResponse,
  UserAuthResponse,
  UserResponse,
  UsersResponse,
} from '../../application/ports/dtos/user.dto';

export interface IUserGrpcService {
  createUser(data: CreateUserRequest): Observable<UserResponse>;

  getUserAuth(data: { userId: string }): Observable<UserAuthResponse>;

  getUsers(data: GetUsersRequest): Observable<UsersResponse>;

  getUser(data: { userId: string }): Observable<UserAdminDetailResponse>;

  getAddresses(data: { userId: string }): Observable<AddressesResponse>;

  createAddress(data: CreateAddressRequest): Observable<AddressResponse>;

  updateAddress(data: UpdateAddressRequest): Observable<AddressResponse>;

  deleteAddress(data: AddressActionRequest): Observable<AddressIdResponse>;

  setDefaultAddress(data: AddressActionRequest): Observable<AddressResponse>;

  getWishlist(data: { userId: string }): Observable<WishlistResponse>;

  addWishlistItem(data: AddWishlistItemRequest): Observable<WishlistActionResponse>;

  removeWishlistItem(data: RemoveWishlistItemRequest): Observable<WishlistActionResponse>;
}
