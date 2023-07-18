import { Module } from '@nestjs/common'
import { PrismaModule } from '@service/prisma'
import { AppModule } from './app/app.module'

@Module({
  imports: [PrismaModule, AppModule],
})
export class MainModule {}
