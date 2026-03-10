import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterCommand } from '../../application/commands/register.command';
import { Controller, UseInterceptors } from '@nestjs/common';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('AuthorizerService', 'registerUser')
  async create(@Payload() body: RegisterDto) {
    try {
      const { email, password, firstName, lastName } = body;
      return await this.commandBus.execute(
        new RegisterCommand(email, password, firstName, lastName),
      );
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      throw new RpcException({
        code: error.code ?? error.error.code,
        message: error.details || error.message,
      });
    }
  }
}
