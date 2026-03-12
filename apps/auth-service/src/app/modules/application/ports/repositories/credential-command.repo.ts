import { Credential } from '../../../domain/entities/credential.entity';
import { CredentialBodyDto } from '../dtos/credential.dto';

export abstract class ICredentialCommandRepository {
  abstract save(credential: Credential): Promise<void>;

  abstract create(credential: Credential): Promise<void>;

  abstract update(credential: CredentialBodyDto): Promise<void>;

  abstract updatePassword(userId: string, passwordHash: string): Promise<void>;
}
