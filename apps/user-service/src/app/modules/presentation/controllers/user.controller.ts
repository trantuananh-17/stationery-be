import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CreateUserCommand } from '../../application/commands/create-user/create-user.command';
import { GetUserAuthQuery } from '../../application/queries/get-user-auth/get-user-auth.query';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserGrpcExceptionFilter } from '../filters/user-grpc-exception.filter';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(UserGrpcExceptionFilter)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'createUser')
  async create(@Payload() body: CreateUserDto) {
    const { email, firstName, lastName, roleName } = body;
    return await this.commandBus.execute(
      new CreateUserCommand(email, firstName, lastName, roleName),
    );
  }

  @GrpcMethod('UserService', 'getUserAuth')
  getUserAuth(@Payload() { userId }: { userId: string }) {
    return this.queryBus.execute(new GetUserAuthQuery(userId));
  }
}
