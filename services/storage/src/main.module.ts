import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from '@service/prisma'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ResponseHeaderInterceptor } from '@service/core'
import { StorageProviderModule } from './provider/storage-provider.module'
import { StorageModule } from './storage.module'
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
    StorageProviderModule,
    StorageModule,
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
