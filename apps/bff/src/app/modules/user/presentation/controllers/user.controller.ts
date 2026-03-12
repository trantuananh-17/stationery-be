import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Body, Controller, Get, Inject, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterReponseDto } from '../dtos/register-response.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserPort } from '../../application/ports/user.port';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userPort: UserPort) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ type: ResponseDto<RegisterReponseDto> })
  @ApiOperation({ summary: 'Create a new user' })
  register(@Body() body: CreateUserDto) {
    const result = this.userPort.createUser(body);
    Logger.log(`User registration request: ${JSON.stringify(result)}`);
    return result;
  }
}
