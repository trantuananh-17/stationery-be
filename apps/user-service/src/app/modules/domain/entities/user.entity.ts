import { Gender } from '../enums/gender.enum';
import { Email } from '../value-objects/email.vo';

export type UserParams = {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: Email;
  roleId: string;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  avatar?: string;
  stripeCustomerId?: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class User {
  constructor(private params: UserParams) {}

  static create(email: Email, firstName: string, lastName: string, roleId: string) {
    const now = new Date();
    return new User({
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      roleId,
      createdAt: now,
      updatedAt: now,
    });
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  get id(): string {
    return this.params.id;
  }

  get firstName(): string {
    return this.params.firstName;
  }

  get lastName(): string {
    return this.params.lastName;
  }

  get email(): Email {
    return this.params.email;
  }

  get roleId(): string {
    return this.params.roleId;
  }

  get gender(): Gender | undefined {
    return this.params.gender;
  }

  get dateOfBirth(): Date | undefined {
    return this.params.dateOfBirth;
  }

  get phone(): string | undefined {
    return this.params.phone;
  }

  get avatar(): string | undefined {
    return this.params.avatar;
  }

  get stripeCustomerId(): string | undefined {
    return this.params.stripeCustomerId;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
