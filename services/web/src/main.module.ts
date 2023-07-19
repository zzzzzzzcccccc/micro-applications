import { Module } from '@nestjs/common'
import { PrismaModule } from '@service/prisma'
import { RedisModule } from './redis/redis.module'
import { AppModule } from './app/app.module'
import { FeatureModule } from './feature/feature.module'

@Module({
  imports: [PrismaModule, RedisModule, AppModule, FeatureModule],
})
export class MainModule {}
