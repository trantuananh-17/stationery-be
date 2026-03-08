import { CredentialBodyDto } from '../dtos/credential.dto';

export abstract class ICredentialCommandRepository {
  abstract create(credential: CredentialBodyDto): Promise<void>;

  abstract update(credential: CredentialBodyDto): Promise<void>;

  abstract updatePassword(userId: string, passwordHash: string): Promise<void>;
}
