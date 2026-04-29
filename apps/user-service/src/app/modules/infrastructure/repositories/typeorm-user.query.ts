import { Injectable, Logger } from '@nestjs/common';
import { IUserQueryRepository } from '../../application/ports/repositories/user-query.repo';
import { GetUserAuthDto } from '../../application/queries/get-user-auth/get-user-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/typeorm-user.entity';

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
}
