import { ResponseType } from './response.interface';
import { Observable } from 'rxjs';

export interface TcpClient {
  send<TResult = unknown, TInput = unknown>(
    pattern: string | Record<string, unknown>,
    data?: TInput,
  ): Observable<ResponseType<TResult>>;
  emit<TResult = unknown, TInput = unknown>(
    pattern: string | Record<string, unknown>,
    data?: TInput,
  ): Observable<ResponseType<TResult>>;
}
