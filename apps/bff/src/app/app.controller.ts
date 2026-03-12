import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { map } from 'rxjs';
import { UserData } from '@common/decorators/user-data.decorator';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_STATIONERY_SERVICE') private readonly stationeryClient: TcpClient,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getData(@UserData() user: JwtPayload) {
    console.log(user);
  }

  @Get('stationery')
  getStationery(@ProcessId() processId: string) {
    return this.stationeryClient
      .send('get_stationery', { processId: processId, data: 100 })
      .pipe(map((data) => new ResponseDto({ data })));
  }
}
