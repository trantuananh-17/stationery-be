import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { status } from '@grpc/grpc-js';
import { Controller, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { EmailAlreadyExistsError } from '../../domain/errors/email-already-exists.error';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InvalidEmail } from '../../domain/errors/email-invalid.error';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'createUser')
  async create(@Payload() body: CreateUserDto) {
    try {
      const { email, firstName, lastName, roleName } = body;
      return await this.commandBus.execute(
        new CreateUserCommand(email, firstName, lastName, roleName),
      );
    } catch (e) {
      if (e instanceof EmailAlreadyExistsError) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: e.message,
        });
      }
      if (e instanceof InvalidEmail) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: e.message,
        });
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
