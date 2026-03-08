import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterReponseDto } from '../dtos/register-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthPort } from '../../application/ports/auth.port';
import { Response } from '@common/interfaces/grpc/common/response.interface';

@ApiTags('Auth')
@Controller('auths')
export class AuthController {
  constructor(private readonly authPort: AuthPort) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<RegisterReponseDto> })
  @ApiOperation({ summary: 'Create a new Auth' })
  async register(@Body() body: RegisterDto) {
    const result = await this.authPort.registerUser(body);
    Logger.log(`Auth registration request: ${JSON.stringify(result)}`);
    return Response.success(result);
  }
}
