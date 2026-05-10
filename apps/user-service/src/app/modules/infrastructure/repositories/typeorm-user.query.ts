import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserQueryRepository } from '../../application/ports/repositories/user-query.repo';
import { GetUserAuthDto } from '../../application/queries/get-user-auth/get-user-auth.dto';
import { UserDto } from '../../application/queries/get-users/get-users.dto';
import { UserSort } from '../../domain/enums/user-sort.enum';
import { CustomerSummaryOrmEntity } from '../entities/typeorm-customer-summary.entity';
import { LastOrderOrmEntity } from '../entities/typeorm-last-order.entity';
import { UserOrmEntity } from '../entities/typeorm-user.entity';
import { UserAdminDetailDto } from '../../application/queries/get-user/get-user.dto';

@Injectable()
export class TypeOrmUserQueryRepository implements IUserQueryRepository {
  constructor(@InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>) {}

  async getPayload(userId: string): Promise<GetUserAuthDto | null> {
    const rows = await this.repo
      .createQueryBuilder('u')
      .leftJoin('u.role', 'r')
      .leftJoin('r.permissions', 'p')
      .select([
        'u.id AS user_id',
        'u.firstName AS first_name',
        'u.lastName AS last_name',
        'u.email AS email',
        'u.avatar AS avatar',
        'r.name AS role',
        'p.name AS permission',
      ])
      .where('u.id = :userId', { userId })
      .getRawMany();

    if (!rows.length) {
      return null;
    }

    return {
      userId: rows[0].user_id,
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      email: rows[0].email,
      avatar: rows[0].avatar_url,
      role: rows[0].role,
      permissions: rows.map((r) => r.permission),
    };
  }

  async findAll(filters: {
    search?: string;
    orderBy?: UserSort;
    page: number;
    limit: number;
  }): Promise<QueryResult<UserDto>> {
    const { search, orderBy, page, limit } = filters;

    const qb = this.repo
      .createQueryBuilder('u')
      .leftJoin('u.customerSummary', 'cs')
      .leftJoin('u.lastOrder', 'lo');

    if (search?.trim()) {
      qb.andWhere(
        `
      (
        LOWER(u.first_name) LIKE LOWER(:search)
        OR LOWER(u.last_name) LIKE LOWER(:search)
        OR LOWER(u.email) LIKE LOWER(:search)
        OR LOWER(lo.order_number) LIKE LOWER(:search)
      )
      `,
        {
          search: `%${search.trim()}%`,
        },
      );
    }

    const total = await qb.clone().getCount();

    qb.select([
      'u.id AS id',
      'u.email AS email',

      `
    CONCAT(
      u.first_name,
      ' ',
      u.last_name
    ) AS "fullName"
    `,

      'u.first_name AS "firstName"',
      'u.last_name AS "lastName"',

      `
    CAST(
      COALESCE(cs.total_orders, 0)
      AS INTEGER
    ) AS "totalOrder"
    `,

      `
    CAST(
      COALESCE(cs.amount_spent, 0)
      AS DECIMAL
    ) AS "totalPrice"
    `,

      'COALESCE(cs.is_verified, false) AS "isVerified"',
      'COALESCE(cs.is_active, false) AS "isActive"',

      'u.created_at AS "createdAt"',
    ]);

    switch (orderBy) {
      case UserSort.ORDER_ASC:
        qb.orderBy('CAST(COALESCE(cs.total_orders, 0) AS INTEGER)', 'ASC');
        break;

      case UserSort.ORDER_DESC:
        qb.orderBy('CAST(COALESCE(cs.total_orders, 0) AS INTEGER)', 'DESC');
        break;

      case UserSort.PRICE_ASC:
        qb.orderBy('CAST(COALESCE(cs.amount_spent, 0) AS DECIMAL)', 'ASC');
        break;

      case UserSort.PRICE_DESC:
        qb.orderBy('CAST(COALESCE(cs.amount_spent, 0) AS DECIMAL)', 'DESC');
        break;

      case UserSort.CREATED_AT_ASC:
        qb.orderBy('u.created_at', 'ASC');
        break;

      case UserSort.CREATED_AT_DESC:
        qb.orderBy('u.created_at', 'DESC');
        break;

      default:
        qb.orderBy('u.created_at', 'DESC');
    }

    qb.offset((page - 1) * limit).limit(limit);

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        totalOrder: Number(r.totalOrder),
        totalPrice: Number(r.totalPrice),
        isVerified: r.isVerified,
        isActive: r.isActive,
        createdAt: new Date(r.createdAt),
      })),
      total,
    };
  }

  async findById(userId: string): Promise<UserAdminDetailDto | null> {
    const qb = this.repo
      .createQueryBuilder('u')
      .leftJoin('u.customerSummary', 'cs')
      .leftJoin('u.lastOrder', 'lo')
      .where('u.id = :userId', {
        userId,
      });

    qb.select([
      'u.id AS id',

      `
    CONCAT(
      u.first_name,
      ' ',
      u.last_name
    ) AS "fullName"
    `,

      'u.first_name AS "firstName"',
      'u.last_name AS "lastName"',

      'u.email AS email',
      'u.phone AS phone',

      'u.avatar AS avatar',

      'u.gender AS gender',
      'u.date_of_birth AS "dateOfBirth"',

      'COALESCE(cs.is_verified, false) AS "isVerified"',
      'COALESCE(cs.is_active, false) AS "isActive"',

      'COALESCE(cs.total_orders, 0) AS "totalOrders"',
      'COALESCE(cs.amount_spent, 0) AS "amountSpent"',

      'cs.customer_since AS "customerSince"',

      'lo.order_id AS "lastOrderId"',
      'lo.order_number AS "lastOrderNumber"',
      'lo.total_price AS "lastOrderTotalPrice"',
      'lo.order_status AS "lastOrderStatus"',
      'lo.payment_status AS "lastOrderPaymentStatus"',
      'lo.ordered_at AS "lastOrderedAt"',
      'lo.items AS "lastOrderItems"',

      'u.created_at AS "createdAt"',
    ]);

    const raw = await qb.getRawOne();

    if (!raw) {
      return null;
    }

    return {
      id: raw.id,

      fullName: raw.fullName,

      firstName: raw.firstName,
      lastName: raw.lastName,

      email: raw.email,
      phone: raw.phone,

      avatar: raw.avatar,

      gender: raw.gender,
      dateOfBirth: raw.dateOfBirth ? new Date(raw.dateOfBirth) : undefined,

      isVerified: raw.isVerified,
      isActive: raw.isActive,

      totalOrders: Number(raw.totalOrders),
      amountSpent: Number(raw.amountSpent),

      customerSince: new Date(raw.customerSince),

      lastOrder: raw.lastOrderId
        ? {
            orderId: raw.lastOrderId,
            orderNumber: raw.lastOrderNumber,

            totalPrice: Number(raw.lastOrderTotalPrice),

            orderStatus: raw.lastOrderStatus,
            paymentStatus: raw.lastOrderPaymentStatus,

            orderedAt: new Date(raw.lastOrderedAt),

            items: raw.lastOrderItems ?? [],
          }
        : undefined,

      createdAt: new Date(raw.createdAt),
    };
  }
}
