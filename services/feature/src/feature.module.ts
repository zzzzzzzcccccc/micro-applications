import { Module } from '@nestjs/common'
import { PrismaModule } from '@service/prisma'
import { FeatureController } from './feature.controller'
import { FeatureService } from './feature.service'

@Module({
  imports: [PrismaModule],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
