import { Injectable, Logger } from '@nestjs/common'
import { MinioService } from './minio.service'
import { StorageProvider } from '@service/core'

@Injectable()
export class StorageProviderService {
  private readonly logger: Logger = new Logger('StorageProviderService')

  constructor(private readonly minioService: MinioService) {}

  public async createBucket(provider: string, name: string, metadata: Record<string, any>) {
    try {
      return await this.usingService(provider).createBucket(name, metadata)
    } catch (e: any) {
      this.logger.error(`Error creating bucket by ${provider} ${e?.message}`)
      throw e
    }
  }

  private usingService(provider: string) {
    switch (provider) {
      case StorageProvider.MINIO:
        return this.minioService
      default:
        throw new Error('Unknown storage provider')
    }
  }
}
