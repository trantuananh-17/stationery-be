import {
  AccountInactiveError,
  EmailAlreadyVerifiedError,
  InvalidCurrentPasswordError,
  InvalidResetTokenError,
  InvalidVerificationTokenError,
  ResetTokenExpiredError,
  ResetTokenNotFoundError,
  VerificationTokenExpiredError,
  VerificationTokenNotFoundError,
} from '../errors/credential.error';

export type CredentialParams = {
  readonly id: string;
  readonly userId: string;
  readonly email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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

  activate() {
    this.params.isActive = true;
    this.setUpdatedAt();
  }

  deactivate() {
    this.params.isActive = false;
    this.setUpdatedAt();
  }

  changePassword(oldHash: string, newHash: string) {
    if (this.params.passwordHash !== oldHash) {
      throw new InvalidCurrentPasswordError();
    }

    this.params.passwordHash = newHash;
    this.setUpdatedAt();
  }

  updatePassword(passwordHash: string) {
    this.params.passwordHash = passwordHash;
    this.setUpdatedAt();
  }

  setVerificationToken(token: string, expires: Date) {
    if (this.params.isEmailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    this.params.verificationToken = token;
    this.params.verificationExpires = expires;

    this.setUpdatedAt();
  }

  canResendVerification(): boolean {
    if (this.params.isEmailVerified) return false;

    if (!this.params.verificationExpires) return true;

    return this.params.verificationExpires < new Date();
  }

  verifyEmail(token: string) {
    if (this.params.isEmailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    if (!this.params.verificationToken) {
      throw new VerificationTokenNotFoundError();
    }

    if (this.params.verificationToken !== token) {
      throw new InvalidVerificationTokenError();
    }

    if (this.params.verificationExpires && this.params.verificationExpires < new Date()) {
      throw new VerificationTokenExpiredError();
    }

    this.params.isEmailVerified = true;

    this.clearVerificationToken();

    this.setUpdatedAt();
  }

  clearVerificationToken() {
    this.params.verificationToken = undefined;
    this.params.verificationExpires = undefined;
  }

  setResetPasswordToken(token: string, expires: Date) {
    this.params.resetPasswordToken = token;
    this.params.resetPasswordExpires = expires;

    this.setUpdatedAt();
  }

  resetPassword(token: string, passwordHash: string) {
    if (!this.params.isActive) {
      throw new AccountInactiveError();
    }

    if (!this.params.resetPasswordToken) {
      throw new ResetTokenNotFoundError();
    }

    if (this.params.resetPasswordToken !== token) {
      throw new InvalidResetTokenError();
    }

    if (this.params.resetPasswordExpires && this.params.resetPasswordExpires < new Date()) {
      throw new ResetTokenExpiredError();
    }

    this.params.passwordHash = passwordHash;

    this.clearResetPasswordToken();

    this.setUpdatedAt();
  }

  clearResetPasswordToken() {
    this.params.resetPasswordToken = undefined;
    this.params.resetPasswordExpires = undefined;
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
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

  get verificationToken(): string | undefined {
    return this.params.verificationToken;
  }

  get verificationExpires(): Date | undefined {
    return this.params.verificationExpires;
  }

  get resetPasswordToken(): string | undefined {
    return this.params.resetPasswordToken;
  }

  get resetPasswordExpires(): Date | undefined {
    return this.params.resetPasswordExpires;
  }
}
