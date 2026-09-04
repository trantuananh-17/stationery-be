import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithMetadata } from '@common/interfaces/common/request-with-metadata.interface';
import { getProcessId } from '@common/utils/string.util';
import { MetadataKeys } from '@common/constants/common.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: RequestWithMetadata, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;

    // 1 tiến trình -> nhiều service -> process id để truy vết log rõ ràng
    const processId = getProcessId();

    const now = Date.now();

    // Truyền metadate xuống req để log trong các service sau này

    req[MetadataKeys.PROCESS_ID] = processId;
    req[MetadataKeys.START_TIME] = startTime;

    Logger.log(
      `HTTP >> Start process '${processId}' >> path: '${originalUrl}' >> method: '${method}' at '${now}' >> input: ${JSON.stringify(
        body,
      )}`,
    );

    const originalSend = res.send.bind(res);

    res.send = (body) => {
      const durationMs = Date.now() - startTime;
      Logger.log(
        `HTTP >> End process '${processId}' >> path: '${originalUrl}' >> method: '${method}' at '${now}' >> duration: ${durationMs} ms`,
      );

      return originalSend(body);
    };
    next();
  }
}
