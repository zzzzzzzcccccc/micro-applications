import { Module } from '@nestjs/common'
import { PrismaModule } from '@service/prisma'
import { RedisModule } from '../redis/redis.module'
import { FeatureController } from './feature.controller'
import { FeatureService } from './feature.service'

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
