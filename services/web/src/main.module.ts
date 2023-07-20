import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '@service/prisma'
import { RedisModule } from './redis/redis.module'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ResponseHeaderInterceptor } from './interceptor/response-header.interceptor'
import { AppModule } from './app/app.module'
import { FeatureModule } from './feature/feature.module'
import { RATE_TTL, RATE_LIMIT } from './constants'

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ttl: RATE_TTL,
        limit: RATE_LIMIT,
      }),
    }),
    AppModule,
    FeatureModule,
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
