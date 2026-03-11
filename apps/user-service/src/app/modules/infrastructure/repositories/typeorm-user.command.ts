import { Injectable } from '@nestjs/common';
import { IUserCommandRepository } from '../../application/ports/repositories/user-command.repo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '../entities/typeorm-user.entity';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

@Injectable()
export class TypeOrmUserCommandRepository implements IUserCommandRepository {
  constructor(@InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>) {}

  async create(user: User): Promise<void> {
    await this.repo.save({
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.repo.count({
      where: { email: email.toString() },
    });

    return count > 0;
  }
}
