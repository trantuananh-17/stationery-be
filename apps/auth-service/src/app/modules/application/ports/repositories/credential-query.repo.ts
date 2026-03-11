import { Credential } from '../../../domain/entities/credential.entity';

export abstract class ICredentialQueryRepository {
  abstract findByEmail(email: string): Promise<Credential | null>;
  abstract findByUserId(userId: string): Promise<Credential | null>;
}
