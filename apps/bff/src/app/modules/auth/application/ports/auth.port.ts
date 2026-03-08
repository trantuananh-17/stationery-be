import { Response } from '@common/interfaces/grpc/common/response.interface';
import { RegisterUserBodyDto, UserResponse } from './dtos/auth.dto';

export abstract class AuthPort {
  abstract registerUser(data: RegisterUserBodyDto): Promise<UserResponse>;
}
