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
}
