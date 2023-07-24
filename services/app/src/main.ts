import { NestFactory } from '@nestjs/core'
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { MainModule } from './main.module'
import { HttpExceptionHandler } from '@service/core'

const logger = new Logger('Bootstrap')

async function bootstrap() {
  const app = await NestFactory.create(MainModule)

  initialize(app)

  await app.listen(+process.env.PORT!)
}

function initialize(app: INestApplication) {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Micro application app api').setDescription('Api Docs').setVersion('1.0').build(),
  )
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  })

  app.enableCors({ origin: process.env.CORS_WHITELIST!.split(',') })
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionHandler())
  app.enableShutdownHooks()
}

bootstrap()
  .then(() => logger.log('🚀App service application started🚀'))
  .catch(logger.error)
