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
import { RegisterResponseDto } from '../dtos/register-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserData } from '@common/decorators/user-data.decorator';
import { RefreshTokenUseCase } from '../../application/refresh-token.usecase';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import {
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
} from '../../application/password-reset.usecase';
import { ForgotPasswordDto, ResetPasswordDto } from '../dtos/password-reset.dto';

@ApiTags('Auth')
@Controller('auths')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refresh: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset link' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.execute(body);

    // Luôn trả về như nhau dù email có tồn tại hay không, để không lộ
    // email nào đã đăng ký.
    return { sent: true };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with a token' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(body);

    return { reset: true };
  }

  @Post('register')
  @ApiOkResponse({ type: ResponseDto<RegisterResponseDto> })
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
