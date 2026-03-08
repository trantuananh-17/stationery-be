export type CredentialParams = {
  readonly id: string;
  readonly userId: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Credential {
  constructor(private params: CredentialParams) {}

  static create(userId: string, email: string, passwordHash: string) {
    const now = new Date();

    return new Credential({
      id: crypto.randomUUID(),
      userId,
      email,
      passwordHash,
      isEmailVerified: false,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  updatePassword(passwordHash: string) {
    this.params.passwordHash = passwordHash;
    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get userId(): string {
    return this.params.userId;
  }

  get email(): string {
    return this.params.email;
  }

  get passwordHash(): string {
    return this.params.passwordHash;
  }

  get isEmailVerified(): boolean {
    return this.params.isEmailVerified;
  }

  get isActive(): boolean {
    return this.params.isActive;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
