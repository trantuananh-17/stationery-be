import { Gender } from '../enums/gender.enum';

export type UserParams = {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: string;
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

  static create(email: string, firstName: string, lastName: string) {
    const now = new Date();
    return new User({
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
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
  get email(): string {
    return this.params.email;
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
