import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name;

    // Lấy payload request
    const agrs = context.getArgs();

    // Biến đầu tiên đại diện cho payload request
    const param = agrs[0];

    // Ghi log request
    Logger.log(
      `TCP >> Start process  >> method: '${handlerName}' at '${now}' >> param: ${JSON.stringify(param)}`,
    );

    // rxjs: tap: không tham thay đổi data, map: có thể thay đổi data
    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `TCP >> End process  >> method: '${handlerName}' after: '${Date.now() - now}ms'`,
          ),
        ),
      );
  }
}
