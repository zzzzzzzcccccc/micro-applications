import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common'
import { Prisma } from '@service/prisma'
import { Request, Response } from 'express'

type ResponseBody = {
  url?: string
  statusCode?: string | number
  message?: string | string[]
}

@Catch(HttpException, Prisma.PrismaClientKnownRequestError)
export class HttpExceptionHandler implements ExceptionFilter {
  private readonly logger: Logger = new Logger('HttpExceptionHandler')

  public catch(exception: HttpException | Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const isPrismaError = exception instanceof Prisma.PrismaClientKnownRequestError

    if (isPrismaError) {
      this.catchPrisma(exception as Prisma.PrismaClientKnownRequestError, host)
    } else {
      this.catchHttp(exception as HttpException, host)
    }
  }

  private catchHttp(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as any
    const body = HttpExceptionHandler.buildResponseBody({
      url: request.url,
      statusCode: status,
      message: HttpExceptionHandler.formatMessage(exceptionResponse?.message || exception.message),
    })

    this.logger.warn(`Http response failed:[${request.method}] ${request.url} ${status} ${JSON.stringify(body)}`)

    response.status(status).json(body)
  }

  private catchPrisma(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const code = exception.code
    const errorMessage = exception.message
    const body = HttpExceptionHandler.buildResponseBody({
      url: request.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    })

    this.logger.error(`Prisma client failed:[${request.method}] ${request.url} ${code} ${errorMessage}`)

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body)
  }

  static formatMessage<T>(message: T): string | T {
    if (Array.isArray(message)) {
      return message.join(',')
    }
    return message
  }

  static buildResponseBody(body: ResponseBody) {
    return {
      ...body,
      timestamp: new Date().toISOString(),
    }
  }
}
