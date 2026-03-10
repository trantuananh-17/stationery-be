import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { Gender } from '../../domain/enums/gender.enum';
import { RoleOrmEntity } from './typeorm-role.entity';

@Entity({ name: 'users' })
export class UserOrmEntity extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({
    name: 'date_of_birth',
    type: 'date',
    nullable: true,
  })
  dateOfBirth?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @Column({
    name: 'stripe_customer_id',
    type: 'varchar',
    nullable: true,
  })
  stripeCustomerId?: string;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @ManyToOne(() => RoleOrmEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;
}
