export interface TokenPayloadDto {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export abstract class ITokenService {
  abstract generateAccessToken(payload: TokenPayloadDto): Promise<string>;

  abstract generateRefreshToken(payload: TokenPayloadDto): Promise<string>;

  abstract generateRandomToken(length?: number): string;
}
