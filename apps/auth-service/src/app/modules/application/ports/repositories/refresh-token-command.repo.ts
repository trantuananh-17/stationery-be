import { RefreshTokenBodyDto } from '../dtos/refresh-token.dto';

export abstract class IRefreshTokenCommandRepository {
  abstract create(token: RefreshTokenBodyDto): Promise<void>;

  abstract update(token: RefreshTokenBodyDto): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract deleteByUserId(userId: string): Promise<void>;
}
