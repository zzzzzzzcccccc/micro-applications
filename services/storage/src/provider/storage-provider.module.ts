import { Module } from '@nestjs/common'
import { StorageProviderService } from './storage-provider.service'
import { MinioService } from './minio.service'

@Module({
  providers: [StorageProviderService, MinioService],
  exports: [StorageProviderService],
})
export class StorageProviderModule {}
