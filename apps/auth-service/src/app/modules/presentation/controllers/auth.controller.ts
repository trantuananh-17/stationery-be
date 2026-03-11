import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterCommand } from '../../application/commands/register.command';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthGrpcExceptionFilter } from '../filters/auth-grpc-exception.filter';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(AuthGrpcExceptionFilter)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('AuthorizerService', 'registerUser')
  async create(@Payload() body: RegisterDto) {
    const { email, password, firstName, lastName } = body;
    return await this.commandBus.execute(new RegisterCommand(email, password, firstName, lastName));
  }
}
