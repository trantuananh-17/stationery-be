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
