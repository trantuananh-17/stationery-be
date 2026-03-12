import { InjectRepository } from '@nestjs/typeorm';
import { ICredentialCommandRepository } from '../../application/ports/repositories/credential-command.repo';
import { Injectable } from '@nestjs/common';
import { CredentialOrmEntity } from '../entities/typeorm-credential.entity';
import { Repository } from 'typeorm';
import { CredentialBodyDto } from '../../application/ports/dtos/credential.dto';
import { Credential } from '../../domain/entities/credential.entity';

@Injectable()
export class TypeOrmCredentialCommandRepository implements ICredentialCommandRepository {
  constructor(
    @InjectRepository(CredentialOrmEntity) private readonly repo: Repository<CredentialOrmEntity>,
  ) {}

  async save(credential: Credential): Promise<void> {
    const orm = this.toOrmEntity(credential);
    await this.repo.save(orm);
  }

  async create(credential: Credential): Promise<void> {
    const entity = this.repo.create({
      id: credential.id,
      userId: credential.userId,
      email: credential.email,
      passwordHash: credential.passwordHash,
      isEmailVerified: credential.isEmailVerified,
      isActive: credential.isActive,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt,
    });

    await this.repo.save(entity);
  }

  update(credential: CredentialBodyDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updatePassword(userId: string, passwordHash: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private toOrmEntity(domain: Credential): CredentialOrmEntity {
    const orm = new CredentialOrmEntity();

    orm.id = domain.id;
    orm.userId = domain.userId;
    orm.email = domain.email;
    orm.passwordHash = domain.passwordHash;
    orm.isEmailVerified = domain.isEmailVerified;
    orm.isActive = domain.isActive;
    orm.verificationToken = domain.verificationToken;
    orm.verificationExpires = domain.verificationExpires;
    orm.resetPasswordToken = domain.resetPasswordToken;
    orm.resetPasswordExpires = domain.resetPasswordExpires;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    return orm;
  }
}
