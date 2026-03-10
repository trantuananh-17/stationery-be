import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

export abstract class IUserCommandRepository {
  abstract create(user: User): Promise<void>;

  abstract existsByEmail(email: Email): Promise<boolean>;
}
