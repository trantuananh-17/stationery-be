import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../entities/typeorm-role.entity';
import { IRoleQueryRepository } from '../../application/ports/role-query.repo';
import { Role } from '../../domain/entities/role.entity';
import { RoleName } from '../../domain/enums/role.enum';

@Injectable()
export class TypeOrmRoleQueryRepository implements IRoleQueryRepository {
  constructor(@InjectRepository(RoleOrmEntity) private readonly repo: Repository<RoleOrmEntity>) {}

  async getByName(roleName: RoleName): Promise<Role | null> {
    const role = await this.repo.findOne({
      where: { name: roleName },
    });

    if (!role) return null;

    return this._toDomain(role);
  }

  private _toDomain(typeormRole: RoleOrmEntity): Role {
    const { id, name, description, createdAt, updatedAt } = typeormRole;
    return new Role({
      id,
      name,
      description,
      createdAt,
      updatedAt,
    });
  }
}
