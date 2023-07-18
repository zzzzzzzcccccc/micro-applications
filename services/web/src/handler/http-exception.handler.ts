import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionHandler implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as any

    console.log(exceptionResponse?.message, exception.message)

    response.status(status).json({
      path: request.url,
      timestamp: new Date().toISOString(),
      status_code: status,
      message: HttpExceptionHandler.formatMessage(exceptionResponse?.message || exception.message),
      error_code: exceptionResponse?.error_code || HttpStatus.BAD_REQUEST,
    })
  }

  static formatMessage<T>(message: T): string | T {
    if (Array.isArray(message)) {
      return message.join(',')
    }
    return message
  }
}
