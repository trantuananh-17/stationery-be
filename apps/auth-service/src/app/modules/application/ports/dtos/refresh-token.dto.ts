export interface RefreshTokenBodyDto {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  device?: string;
  ip?: string;
}
