import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { map } from 'rxjs';

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
  getStationery(@ProcessId() processId: string) {
    return this.stationeryClient
      .send('get_stationery', { processId: processId, data: 100 })
      .pipe(map((data) => new ResponseDto({ data })));
  }
}
