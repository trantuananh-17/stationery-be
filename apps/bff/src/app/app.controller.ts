import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_STATIONERY_SERVICE') private readonly stationeryService: ClientProxy,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();

    return new ResponseDto({ data: result });
  }

  @Get('stationery')
  async getStationery() {
    const result = await firstValueFrom(
      this.stationeryService.send<string, number>('get_stationery', 1),
    );

    return new ResponseDto<string>({ data: result });
  }
}
