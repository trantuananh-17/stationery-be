import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserCommand } from '../../application/commands/create-user/create-user.command';
import { GetUserAuthQuery } from '../../application/queries/get-user-auth/get-user-auth.query';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserGrpcExceptionFilter } from '../filters/user-grpc-exception.filter';
import { SyncCustomerSummaryDto } from '../dtos/sync-customer-summary.dto';
import { UpsertSummaryCommand } from '../../application/commands/upsert-sumary/upsert-sumary.command';
import { SyncLastOrderDto } from '../dtos/sync-last-order.dto';
import { UpsertLastOrderCommand } from '../../application/commands/upsert-last-order/upsert-last-order.command';
import { GetUsersDto } from '../dtos/get-users.dto';
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query';
import { getUserDto } from '../dtos/get-user.dto';
import { GetUserQuery } from '../../application/queries/get-user/get-user.query';
import { GetUsersResult } from '../../application/queries/get-users/get-users.handler';
import { Address } from '../../domain/entities/address.entity';
import { CreateAddressCommand } from '../../application/commands/addresses/create-address/create-address.command';
import { UpdateAddressCommand } from '../../application/commands/addresses/update-address/update-address.command';
import { DeleteAddressCommand } from '../../application/commands/addresses/delete-address/delete-address.command';
import { SetDefaultAddressCommand } from '../../application/commands/addresses/set-default-address/set-default-address.command';
import { GetAddressesQuery } from '../../application/queries/get-addresses/get-addresses.query';
import { WishlistItem } from '../../domain/entities/wishlist-item.entity';
import { AddWishlistItemCommand } from '../../application/commands/wishlist/add-wishlist-item/add-wishlist-item.command';
import { RemoveWishlistItemCommand } from '../../application/commands/wishlist/remove-wishlist-item/remove-wishlist-item.command';
import { GetWishlistQuery } from '../../application/queries/get-wishlist/get-wishlist.query';
import {
  AddWishlistItemDto,
  GetWishlistDto,
  RemoveWishlistItemDto,
  AddressActionDto,
  CreateAddressDto,
  GetAddressesDto,
  UpdateAddressDto,
} from '../dtos/address.dto';

/** Shape khớp message AddressGrpcDto trong user.proto. */
const toAddressDto = (address: Address) => ({
  id: address.id,
  userId: address.userId,
  fullName: address.fullName,
  phone: address.phone,
  address1: address.address1,
  address2: address.address2,
  ward: address.ward,
  district: address.district,
  city: address.city,
  isDefault: address.isDefault,
  createdAt: address.createdAt,
});

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(UserGrpcExceptionFilter)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'createUser')
  async create(@Payload() body: CreateUserDto) {
    const { email, firstName, lastName, roleName } = body;
    return await this.commandBus.execute(
      new CreateUserCommand(email, firstName, lastName, roleName),
    );
  }

  @GrpcMethod('UserService', 'getUserAuth')
  getUserAuth(@Payload() { userId }: { userId: string }) {
    return this.queryBus.execute(new GetUserAuthQuery(userId));
  }

  @GrpcMethod('UserService', 'getUsers')
  async getUsers(payload: GetUsersDto) {
    const result: GetUsersResult = await this.queryBus.execute(
      new GetUsersQuery(payload.search, payload.orderBy, payload.page, payload.limit),
    );

    return {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
    };
  }

  @GrpcMethod('UserService', 'getUser')
  getUser(payload: getUserDto) {
    return this.queryBus.execute(new GetUserQuery(payload.userId));
  }

  @GrpcMethod('UserService', 'getAddresses')
  async getAddresses(@Payload() { userId }: GetAddressesDto) {
    const addresses: Address[] = await this.queryBus.execute(new GetAddressesQuery(userId));

    return { data: addresses.map(toAddressDto) };
  }

  @GrpcMethod('UserService', 'createAddress')
  async createAddress(@Payload() payload: CreateAddressDto) {
    const { userId, ...input } = payload;

    const address: Address = await this.commandBus.execute(
      new CreateAddressCommand(userId, input),
    );

    return { data: toAddressDto(address) };
  }

  @GrpcMethod('UserService', 'updateAddress')
  async updateAddress(@Payload() payload: UpdateAddressDto) {
    const { userId, addressId, ...input } = payload;

    const address: Address = await this.commandBus.execute(
      new UpdateAddressCommand(userId, addressId, input),
    );

    return { data: toAddressDto(address) };
  }

  @GrpcMethod('UserService', 'deleteAddress')
  async deleteAddress(@Payload() { userId, addressId }: AddressActionDto) {
    return this.commandBus.execute(new DeleteAddressCommand(userId, addressId));
  }

  @GrpcMethod('UserService', 'setDefaultAddress')
  async setDefaultAddress(@Payload() { userId, addressId }: AddressActionDto) {
    const address: Address = await this.commandBus.execute(
      new SetDefaultAddressCommand(userId, addressId),
    );

    return { data: toAddressDto(address) };
  }

  @GrpcMethod('UserService', 'getWishlist')
  async getWishlist(@Payload() { userId }: GetWishlistDto) {
    const items: WishlistItem[] = await this.queryBus.execute(new GetWishlistQuery(userId));

    return {
      data: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        thumbnail: item.thumbnail,
        price: item.price,
        createdAt: item.createdAt,
      })),
    };
  }

  @GrpcMethod('UserService', 'addWishlistItem')
  async addWishlistItem(@Payload() payload: AddWishlistItemDto) {
    const { userId, ...input } = payload;

    return this.commandBus.execute(new AddWishlistItemCommand(userId, input));
  }

  @GrpcMethod('UserService', 'removeWishlistItem')
  async removeWishlistItem(@Payload() { userId, productId }: RemoveWishlistItemDto) {
    return this.commandBus.execute(new RemoveWishlistItemCommand(userId, productId));
  }

  @MessagePattern('customer.summary.sync')
  async syncCustomerSummary(
    @Payload()
    payload: SyncCustomerSummaryDto,
  ) {
    return this.commandBus.execute(
      new UpsertSummaryCommand(
        payload.userId,
        payload.email,
        payload.isActive,
        payload.isVerified,
        payload.totalOrdersIncrement,
        payload.amountSpentIncrement,
        payload.lastOrderId,
        payload.lastOrderTotal,
        payload.lastOrderAt,
      ),
    );
  }

  @MessagePattern('last-order.sync')
  async syncLastOrder(
    @Payload()
    payload: SyncLastOrderDto,
  ) {
    return this.commandBus.execute(
      new UpsertLastOrderCommand(
        payload.userId,
        payload.orderId,
        payload.orderNumber,
        payload.totalPrice,
        payload.orderStatus,
        payload.paymentStatus,
        payload.orderedAt,
        payload.items,
      ),
    );
  }
}
