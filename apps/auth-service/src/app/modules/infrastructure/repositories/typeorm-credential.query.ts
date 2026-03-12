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

  async findByVerificationToken(token: string): Promise<Credential | null> {
    const credential = await this.repo.findOne({
      where: { verificationToken: token },
    });

    if (!credential) return null;

    return this._toDomain(credential);
  }

  async findByResetPasswordToken(token: string): Promise<Credential | null> {
    const credential = await this.repo.findOne({
      where: { resetPasswordToken: token },
    });

    if (!credential) return null;

    return this._toDomain(credential);
  }

  private _toDomain(typeormCredential: CredentialOrmEntity): Credential {
    return new Credential({
      id: typeormCredential.id,
      userId: typeormCredential.userId,
      email: typeormCredential.email,
      passwordHash: typeormCredential.passwordHash,
      isEmailVerified: typeormCredential.isEmailVerified,
      isActive: typeormCredential.isActive,
      verificationToken: typeormCredential.verificationToken,
      verificationExpires: typeormCredential.verificationExpires,
      resetPasswordToken: typeormCredential.resetPasswordToken,
      resetPasswordExpires: typeormCredential.resetPasswordExpires,
      createdAt: typeormCredential.createdAt,
      updatedAt: typeormCredential.updatedAt,
    });
  }
}
