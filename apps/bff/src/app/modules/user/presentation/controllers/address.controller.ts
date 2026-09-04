import { UserData } from '@common/decorators/user-data.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserPort } from '../../application/ports/user.port';
import { AddressBodyDto, AddressResponseDto } from '../dtos/address.dto';

@ApiTags('Address')
@ApiBearerAuth()
@Controller('users/me/addresses')
export class AddressController {
  constructor(private readonly userPort: UserPort) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my addresses' })
  @ApiOkResponse({ type: ResponseDto<AddressResponseDto[]> })
  @HttpCode(HttpStatus.OK)
  async getAddresses(@UserData('userId') userId: string) {
    const result = await this.userPort.getAddresses({ userId });

    return result.data ?? [];
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new address' })
  @ApiOkResponse({ type: ResponseDto<AddressResponseDto> })
  @HttpCode(HttpStatus.CREATED)
  async createAddress(@UserData('userId') userId: string, @Body() body: AddressBodyDto) {
    const result = await this.userPort.createAddress({
      userId,
      ...body,
      isDefault: body.isDefault ?? false,
    });

    return result.data;
  }

  @Put(':addressId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({ name: 'addressId', type: String, format: 'uuid' })
  @ApiOkResponse({ type: ResponseDto<AddressResponseDto> })
  @HttpCode(HttpStatus.OK)
  async updateAddress(
    @UserData('userId') userId: string,
    @Param('addressId', new ParseUUIDPipe()) addressId: string,
    @Body() body: AddressBodyDto,
  ) {
    const result = await this.userPort.updateAddress({
      userId,
      addressId,
      ...body,
      isDefault: body.isDefault ?? false,
    });

    return result.data;
  }

  @Patch(':addressId/default')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set an address as default' })
  @ApiParam({ name: 'addressId', type: String, format: 'uuid' })
  @ApiOkResponse({ type: ResponseDto<AddressResponseDto> })
  @HttpCode(HttpStatus.OK)
  async setDefaultAddress(
    @UserData('userId') userId: string,
    @Param('addressId', new ParseUUIDPipe()) addressId: string,
  ) {
    const result = await this.userPort.setDefaultAddress({ userId, addressId });

    return result.data;
  }

  @Delete(':addressId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'addressId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async deleteAddress(
    @UserData('userId') userId: string,
    @Param('addressId', new ParseUUIDPipe()) addressId: string,
  ) {
    return this.userPort.deleteAddress({ userId, addressId });
  }
}
