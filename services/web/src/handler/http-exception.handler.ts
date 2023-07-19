import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionHandler implements ExceptionFilter {
  private readonly logger: Logger = new Logger('HttpExceptionHandler')

  public catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as any

    const body = {
      path: request.url,
      timestamp: new Date().toISOString(),
      status_code: status,
      message: HttpExceptionHandler.formatMessage(exceptionResponse?.message || exception.message),
      error_code: exceptionResponse?.error_code || HttpStatus.BAD_REQUEST,
    }

    this.logger.warn(`[${request.method}] ${request.url} ${status} ${JSON.stringify(body)}`)

    response.status(status).json(body)
  }

  static formatMessage<T>(message: T): string | T {
    if (Array.isArray(message)) {
      return message.join(',')
    }
    return message
  }
}
