import { Module } from '@nestjs/common'
import { PrismaModule } from '@service/prisma'
import { StorageProviderModule } from './provider/storage-provider.module'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'

@Module({
  imports: [PrismaModule, StorageProviderModule],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
