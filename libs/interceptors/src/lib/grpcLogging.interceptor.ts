import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const handler = context.getHandler();
    const handlerName = handler.name;

    const rpcContext = context.switchToRpc();

    // payload request
    const data = rpcContext.getData();

    // metadata grpc (token, headers...)
    const metadata = rpcContext.getContext();

    Logger.log(
      `gRPC >> Start process >> method: '${handlerName}' at '${now}' >> payload: ${JSON.stringify(data)}`,
    );

    return next
      .handle()
      .pipe(
        tap((response) =>
          Logger.log(
            `gRPC >> End process >> method: '${handlerName}' after '${Date.now() - now}ms' >> response: ${JSON.stringify(response)}`,
          ),
        ),
      );
  }
}
