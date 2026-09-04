import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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

import { UserPort } from '../../application/ports/user.port';

import { IUserGrpcService } from './user-grpc.interface';

@Injectable()
export class UserGrpcAdapter implements UserPort, OnModuleInit {
  private userService: IUserGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.USER_SERVICE)
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService = this.userClient.getService<IUserGrpcService>('UserService');
  }

  createUser(data: CreateUserRequest): Promise<UserResponse> {
    return firstValueFrom(this.userService.createUser(data));
  }

  getUserAuth(data: { userId: string }): Promise<UserAuthResponse> {
    return firstValueFrom(this.userService.getUserAuth(data));
  }

  getUsers(data: GetUsersRequest): Promise<UsersResponse> {
    return firstValueFrom(this.userService.getUsers(data));
  }

  getUser(data: { userId: string }): Promise<UserAdminDetailResponse> {
    return firstValueFrom(this.userService.getUser(data));
  }

  getAddresses(data: { userId: string }): Promise<AddressesResponse> {
    return firstValueFrom(this.userService.getAddresses(data));
  }

  createAddress(data: CreateAddressRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userService.createAddress(data));
  }

  updateAddress(data: UpdateAddressRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userService.updateAddress(data));
  }

  deleteAddress(data: AddressActionRequest): Promise<AddressIdResponse> {
    return firstValueFrom(this.userService.deleteAddress(data));
  }

  setDefaultAddress(data: AddressActionRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userService.setDefaultAddress(data));
  }

  getWishlist(data: { userId: string }): Promise<WishlistResponse> {
    return firstValueFrom(this.userService.getWishlist(data));
  }

  addWishlistItem(data: AddWishlistItemRequest): Promise<WishlistActionResponse> {
    return firstValueFrom(this.userService.addWishlistItem(data));
  }

  removeWishlistItem(data: RemoveWishlistItemRequest): Promise<WishlistActionResponse> {
    return firstValueFrom(this.userService.removeWishlistItem(data));
  }
}
