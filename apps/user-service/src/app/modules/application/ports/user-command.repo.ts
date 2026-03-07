import { User } from '../../domain/entities/user.entity';

export abstract class IRoleCommandRepository {
  abstract create(user: User): Promise<void>;
}
