import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'createUser')
  async create(@Payload() body: CreateUserDto) {
    const { email, firstName, lastName } = body;
    return this.commandBus.execute(new CreateUserCommand(email, firstName, lastName));
  }
}
