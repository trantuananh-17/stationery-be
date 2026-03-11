import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';

@Entity({ name: 'credentials' })
export class CredentialOrmEntity extends BaseEntity {
  @Index()
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    name: 'verification_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  verificationToken?: string;

  @Column({
    name: 'verification_expires',
    type: 'timestamp',
    nullable: true,
  })
  verificationExpires?: Date;

  @Column({
    name: 'reset_password_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  resetPasswordToken?: string;

  @Column({
    name: 'reset_password_expires',
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordExpires?: Date;
}
