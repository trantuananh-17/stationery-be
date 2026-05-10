import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IUserQueryRepository } from '../../ports/repositories/user-query.repo';

import { GetUserQuery } from './get-user.query';
import { UserAdminDetailDto, UserAdminDetailGrpcDto } from './get-user.dto';
import { UserNotFound } from '../../../domain/errors/user-not-found.error';
import { toTimestamp } from '@common/utils/common.util';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export type GetUserResult = UserAdminDetailGrpcDto;

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, GetUserResult> {
  constructor(private readonly userRepo: IUserQueryRepository) {}

  async execute(query: GetUserQuery): Promise<GetUserResult> {
    const { userId } = query;

    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new UserNotFound();
    }

    return {
      id: user.id,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      gender: user.gender,
      dateOfBirth: toTimestamp(user.dateOfBirth) as GrpcTimestamp,
      isVerified: user.isVerified,
      isActive: user.isActive,
      totalOrders: user.totalOrders,
      amountSpent: user.amountSpent,
      customerSince: toTimestamp(user.customerSince) as GrpcTimestamp,
      lastOrder: user.lastOrder
        ? {
            orderId: user.lastOrder.orderId,
            orderNumber: user.lastOrder.orderNumber,
            totalPrice: user.lastOrder.totalPrice,
            orderStatus: user.lastOrder.orderStatus,
            paymentStatus: user.lastOrder.paymentStatus,
            orderedAt: toTimestamp(user.lastOrder.orderedAt) as GrpcTimestamp,
            items: user.lastOrder.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              thumbnail: item.thumbnail,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          }
        : undefined,
      createdAt: toTimestamp(user.createdAt) as GrpcTimestamp,
    };
  }
}
