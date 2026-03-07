import { Role } from '../../domain/entities/role.entity';

export abstract class IRoleQueryRepository {
  abstract getAll(page: number, limit: number): Promise<Role[]>;
  abstract getById(): Promise<Role | null>;
  abstract getByName(): Promise<Role | null>;
}
