import { ProcessId } from '@common/decorators/processId.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { OwnerGuard } from '@common/guards/owner.guard';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { map } from 'rxjs';
import { AppService } from './app.service';
import { Permissions } from '@common/decorators/permission.decorator';
import { PERMISSION } from '@common/constants/enums/permissions.enum';
import { PermissionGuard } from '@common/guards/permission.guard';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_STATIONERY_SERVICE') private readonly stationeryClient: TcpClient,
  ) {}

  @ApiBearerAuth()
  @Permissions([PERMISSION.USER_DELETE])
  @UseGuards(JwtAuthGuard, OwnerGuard, PermissionGuard)
  @Get('test-owner/:id')
  testOwner(@UserData() user: JwtPayload, @Param('id') id: string) {
    console.log('JWT USER:', user);
    console.log('PARAM ID:', id);

    return {
      message: 'OwnerGuard passed',
    };
  }

  @Get('stationery')
  getStationery(@ProcessId() processId: string) {
    return this.stationeryClient
      .send('get_stationery', { processId: processId, data: 100 })
      .pipe(map((data) => new ResponseDto({ data })));
  }
}
