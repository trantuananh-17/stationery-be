interface TokenBodyDto {
  userId: string;
  email: string;
}

export abstract class ITokenService {
  abstract generateAccessToken(userId: TokenBodyDto): Promise<string>;

  abstract generateRefreshToken(userId: TokenBodyDto): Promise<string>;
}
