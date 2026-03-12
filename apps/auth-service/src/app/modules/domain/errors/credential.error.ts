import { BaseError } from './base.error';

export class AccountInactiveError extends BaseError {
  constructor() {
    super('ACCOUNT_INACTIVE', 'Account is inactive');
  }
}

export class AccountLockedError extends BaseError {
  constructor() {
    super('ACCOUNT_LOCKED', 'ACCOUNT_LOCKED');
  }
}

export class CredentialNotFoundError extends BaseError {
  constructor() {
    super('ACCOUNT_NOT_FOUND', 'ACCOUNT_NOT_FOUND');
  }
}

export class EmailAlreadyVerifiedError extends BaseError {
  constructor() {
    super('EMAIL_ALREADY_VERIFIED', 'EMAIL_ALREADY_VERIFIED');
  }
}

export class EmailNotVerifiedError extends BaseError {
  constructor() {
    super('EMAIL_NOT_VERIFIED', 'EMAIL_NOT_VERIFIED');
  }
}

export class InvalidCredentialError extends BaseError {
  constructor() {
    super('INVALID_CREDENTIALS', 'INVALID_CREDENTIALS');
  }
}

export class InvalidCurrentPasswordError extends BaseError {
  constructor() {
    super('INVALID_CURRENT_PASSWORD', 'INVALID_CURRENT_PASSWORD');
  }
}

export class InvalidResetTokenError extends BaseError {
  constructor() {
    super('INVALID_RESET_TOKEN', 'INVALID_RESET_TOKEN');
  }
}

export class InvalidVerificationTokenError extends BaseError {
  constructor() {
    super('INVALID_VERIFICATION_TOKEN', 'INVALID_VERIFICATION_TOKEN');
  }
}

export class ResetTokenExpiredError extends BaseError {
  constructor() {
    super('RESET_TOKEN_EXPIRED', 'RESET_TOKEN_EXPIRED');
  }
}

export class ResetTokenNotFoundError extends BaseError {
  constructor() {
    super('RESET_TOKEN_NOT_FOUND', 'RESET_TOKEN_NOT_FOUND');
  }
}

export class VerificationCooldownError extends BaseError {
  constructor() {
    super('VERIFICATION_COOLDOWN', 'VERIFICATION_COOLDOWN');
  }
}

export class VerificationTokenExpiredError extends BaseError {
  constructor() {
    super('VERIFICATION_TOKEN_EXPIRED', 'VERIFICATION_TOKEN_EXPIRED');
  }
}

export class VerificationTokenNotFoundError extends BaseError {
  constructor() {
    super('VERIFICATION_TOKEN_NOT_FOUND', 'VERIFICATION_TOKEN_NOT_FOUND');
  }
}
