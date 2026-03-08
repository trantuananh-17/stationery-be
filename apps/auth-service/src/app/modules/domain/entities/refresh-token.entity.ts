export type RefreshTokenParams = {
  readonly id: string;
  readonly userId: string;
  tokenHash: string;
  device?: string;
  ip?: string;
  revoked: boolean;
  readonly createdAt: Date;
  expiresAt: Date;
};

export class RefreshToken {
  constructor(private params: RefreshTokenParams) {}

  static create(userId: string, tokenHash: string, expiresAt: Date, device?: string, ip?: string) {
    return new RefreshToken({
      id: crypto.randomUUID(),
      userId,
      tokenHash,
      device,
      ip,
      revoked: false,
      createdAt: new Date(),
      expiresAt,
    });
  }

  revoke() {
    this.params.revoked = true;
  }

  isExpired(): boolean {
    return this.params.expiresAt.getTime() < Date.now();
  }

  get id(): string {
    return this.params.id;
  }

  get userId(): string {
    return this.params.userId;
  }

  get tokenHash(): string {
    return this.params.tokenHash;
  }

  get device(): string | undefined {
    return this.params.device;
  }

  get ip(): string | undefined {
    return this.params.ip;
  }

  get revoked(): boolean {
    return this.params.revoked;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get expiresAt(): Date {
    return this.params.expiresAt;
  }
}
