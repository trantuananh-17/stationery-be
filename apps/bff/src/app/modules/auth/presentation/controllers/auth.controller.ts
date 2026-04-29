import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from '../../application/login-user.usecase';
import { AuthTokenResponse, RefreshTokenBodyDto } from '../../application/ports/dtos/auth.dto';
import { RegisterUserUseCase } from '../../application/register-user.usecase';
import { LoginDto } from '../dtos/login.dto';
import { RegisterReponseDto } from '../dtos/register-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserData } from '@common/decorators/user-data.decorator';
import { RefreshTokenUseCase } from '../../application/refresh-token.usecase';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@ApiTags('Auth')
@Controller('auths')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refresh: RefreshTokenUseCase,
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
  @ApiOkResponse({ type: ResponseDto<AuthTokenResponse> })
  @ApiOperation({ summary: 'Login account' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const result = await this.loginUser.execute(body);
    Logger.log(`Auth registration request: ${JSON.stringify(result)}`);
    return result;
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: 'refreshToken' })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const result = await this.refresh.execute(body);

    Logger.log(`Refresh token request`);

    return result;
  }
}
