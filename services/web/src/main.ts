import { NestFactory } from '@nestjs/core'
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common'
import { MainModule } from './main.module'
import { HttpExceptionHandler } from './handler/http-exception.handler'

const logger = new Logger('Bootstrap')

async function bootstrap() {
  const app = await NestFactory.create(MainModule)

  initialize(app)

  await app.listen(+process.env.PORT!)
}

function initialize(app: INestApplication) {
  app.setGlobalPrefix('api')
  app.enableCors({ origin: process.env.CORS_WHITELIST!.split(',') })
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionHandler())
  app.enableShutdownHooks()
}

bootstrap().catch(logger.error)
