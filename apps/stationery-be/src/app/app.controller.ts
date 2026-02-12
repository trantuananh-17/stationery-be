import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_stationery')
  getStationery(
    @RequestParams() stationeryId: number,
    @ProcessId() processId: string,
  ): Response<string> {
    return Response.success<string>(`Stationery with id ${stationeryId} from process ${processId}`);
  }
}
