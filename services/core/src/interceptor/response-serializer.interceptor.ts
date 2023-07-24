import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { serializeData } from '../util/serialize'

export class ResponseSerializerInterceptor<T> implements NestInterceptor<T, T> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(map((data) => serializeData(data)))
  }
}
