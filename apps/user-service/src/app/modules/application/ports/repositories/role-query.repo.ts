import { Role } from '../../../domain/entities/role.entity';
import { RoleName } from '../../../domain/enums/role.enum';

export abstract class IRoleQueryRepository {
  abstract getByName(roleName: RoleName): Promise<Role | null>;
}
