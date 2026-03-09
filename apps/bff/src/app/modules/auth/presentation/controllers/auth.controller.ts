import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterReponseDto } from '../dtos/register-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterUserUseCase } from '../../application/register-user.usecase';

@ApiTags('Auth')
@Controller('auths')
export class AuthController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<RegisterReponseDto> })
  @ApiOperation({ summary: 'Create a new Auth' })
  async register(@Body() body: RegisterDto) {
    const result = await this.registerUser.execute(body);
    Logger.log(`Auth registration request: ${JSON.stringify(result)}`);
    return result;
  }
}
