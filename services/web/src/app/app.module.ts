import { Module } from '@nestjs/common'
import { RedisModule } from '../redis/redis.module'
import { PrismaModule } from '@service/prisma'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
