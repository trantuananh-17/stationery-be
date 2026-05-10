import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserData } from '@common/decorators/user-data.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { UserAdminDetailResponse, UsersResponse } from '../../application/ports/dtos/user.dto';
import { UserPort } from '../../application/ports/user.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersDto } from '../dtos/get-users.dto';
import { RegisterReponseDto } from '../dtos/register-response.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userPort: UserPort) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({
    type: ResponseDto<RegisterReponseDto>,
  })
  @ApiOperation({
    summary: 'Create a new user',
  })
  register(@Body() body: CreateUserDto) {
    const result = this.userPort.createUser(body);

    Logger.log(`User registration request: ${JSON.stringify(result)}`);

    return result;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/get-profile')
  @ApiOperation({
    summary: 'Get current user profile',
  })
  getProfile(@UserData('userId') userId: string) {
    Logger.log(`Get profile userId: ${userId}`);

    return this.userPort.getUserAuth({
      userId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get users for admin',
  })
  @ApiOkResponse({
    type: ResponseDto<UsersResponse>,
  })
  getUsers(@Query() query: GetUsersDto) {
    Logger.log(`Get users query: ${JSON.stringify(query)}`);

    return this.userPort.getUsers({
      search: query.search,
      orderBy: query.orderBy,

      page: query.page,
      limit: query.limit,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({
    summary: 'Get user detail for admin',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    type: ResponseDto<UserAdminDetailResponse>,
  })
  getUser(
    @Param('userId', new ParseUUIDPipe())
    userId: string,
  ) {
    Logger.log(`Get user detail: ${userId}`);

    return this.userPort.getUser({
      userId,
    });
  }
}
