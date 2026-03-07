import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterReponseDto } from '../dtos/register-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserPort } from '../../application/ports/user.port';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userPort: UserPort) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<RegisterReponseDto> })
  @ApiOperation({ summary: 'Create a new user' })
  register(@Body() body: RegisterDto) {
    const result = this.userPort.createUser(body);
    Logger.log(`User registration request: ${JSON.stringify(result)}`);
    return result;
  }
}
