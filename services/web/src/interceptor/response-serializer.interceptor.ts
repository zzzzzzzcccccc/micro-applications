import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class ResponseSerializerInterceptor<T> implements NestInterceptor<T, T> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        return this.serializeData(data)
      }),
    )
  }

  private serializeData(data: T): T {
    if (data instanceof Array) {
      return data.map((item) => this.serializeData(item)) as T
    } else if (typeof data === 'object' && data !== null) {
      const serializedData: any = {}
      for (const [key, value] of Object.entries(data)) {
        serializedData[key] = this.serializeValue(value)
      }
      return serializedData as T
    } else {
      return data as T
    }
  }

  private serializeValue(value: T): any {
    if (typeof value === 'bigint') {
      return value.toString()
    } else if (value instanceof Date) {
      return value.toISOString()
    } else if (Array.isArray(value)) {
      return value.map((item) => this.serializeValue(item))
    } else if (typeof value === 'object' && value !== null) {
      return this.serializeData(value)
    } else {
      return value as T
    }
  }
}
