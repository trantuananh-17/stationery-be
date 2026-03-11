import { GetUserAuthDto } from '../../queries/get-user-auth/get-user-auth.dto';

export abstract class IUserQueryRepository {
  abstract getPayload(userId: string): Promise<GetUserAuthDto | null>;
}
