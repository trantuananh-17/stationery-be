import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterReponseDto } from '../dtos/register-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterUserUseCase } from '../../application/register-user.usecase';
import { LoginUserResponse } from '../../application/ports/dtos/auth.dto';
import { LoginDto } from '../dtos/login.dto';
import { LoginUserUseCase } from '../../application/login-user.usecase';

@ApiTags('Auth')
@Controller('auths')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiOkResponse({ type: ResponseDto<RegisterReponseDto> })
  @ApiOperation({ summary: 'Create a new Auth' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    const result = await this.registerUser.execute(body);
    Logger.log(`Auth registration request: ${JSON.stringify(result)}`);
    return result;
  }

  @Post('login')
  @ApiOkResponse({ type: ResponseDto<LoginUserResponse> })
  @ApiOperation({ summary: 'Login account' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const result = await this.loginUser.execute(body);
    Logger.log(`Auth registration request: ${JSON.stringify(result)}`);
    return result;
  }
}
