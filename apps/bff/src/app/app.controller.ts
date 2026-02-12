import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_STATIONERY_SERVICE') private readonly stationeryClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();

    return new ResponseDto({ data: result });
  }

  @Get('stationery')
  async getStationery() {
    return await firstValueFrom(
      this.stationeryClient
        .send('get_stationery', { processId: 1, data: 100 })
        .pipe(map((data) => new ResponseDto({ data }))),
    );
  }
}
