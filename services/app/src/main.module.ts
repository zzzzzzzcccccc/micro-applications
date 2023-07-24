import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '@service/prisma'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ResponseHeaderInterceptor } from '@service/core'
import { AppModule } from './app.module'
import { RATE_TTL, RATE_LIMIT } from './constants'

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ttl: RATE_TTL,
        limit: RATE_LIMIT,
      }),
    }),
    AppModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseHeaderInterceptor,
    },
  ],
})
export class MainModule {}
