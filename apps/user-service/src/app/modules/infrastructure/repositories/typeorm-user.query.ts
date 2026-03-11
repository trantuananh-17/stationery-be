import { Injectable } from '@nestjs/common';
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
      .select(['u.id AS user_id', 'r.name AS role', 'p.name AS permission'])
      .leftJoin('u.role', 'r')
      .leftJoin('r.permissions', 'p')
      .where('u.id = :userId', { userId })
      .getRawMany();

    if (!rows.length) {
      return null;
    }

    return {
      userId: rows[0].user_id,
      role: rows[0].role,
      permissions: rows.map((r) => r.permission),
    };
  }
}
