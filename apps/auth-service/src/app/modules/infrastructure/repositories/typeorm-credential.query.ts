import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialOrmEntity } from '../entities/typeorm-credential.entity';
import { Repository } from 'typeorm';
import { ICredentialQueryRepository } from '../../application/ports/repositories/credential-query.repo';
import { Credential } from '../../domain/entities/credential.entity';

@Injectable()
export class TypeOrmCredentialQueryRepository implements ICredentialQueryRepository {
  constructor(
    @InjectRepository(CredentialOrmEntity) private readonly repo: Repository<CredentialOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<Credential | null> {
    const credential = await this.repo.findOne({
      where: { email },
    });

    if (!credential) return null;

    return this._toDomain(credential);
  }

  findByUserId(userId: string): Promise<Credential | null> {
    throw new Error('Method not implemented.');
  }

  private _toDomain(typeormCredential: CredentialOrmEntity): Credential {
    const { id, userId, email, passwordHash, isEmailVerified, isActive, createdAt, updatedAt } =
      typeormCredential;

    return new Credential({
      id,
      userId,
      email,
      passwordHash,
      isEmailVerified,
      isActive,
      createdAt,
      updatedAt,
    });
  }
}
