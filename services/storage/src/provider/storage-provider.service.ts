import { Injectable, Logger } from '@nestjs/common'
import { MinioService } from './minio.service'
import { StorageProvider } from '@service/core'
import { CreateBucketPayload, UploadSteamPayload, DownloadLinkPayload, RemoveSteamPayload } from './types'

@Injectable()
export class StorageProviderService {
  private readonly logger: Logger = new Logger('StorageProviderService')

  constructor(private readonly minioService: MinioService) {}

  public async createBucket({ provider, ...payload }: CreateBucketPayload) {
    try {
      return await this.usingService(provider).createBucket(payload)
    } catch (e: any) {
      this.logger.error(`Error creating bucket by ${provider} ${e?.message}`)
      throw e
    }
  }

  public async uploadSteam({ provider, ...payload }: UploadSteamPayload) {
    try {
      return await this.usingService(provider).uploadSteam(payload)
    } catch (e: any) {
      this.logger.error(`Error upload stream by ${provider} ${e?.message}`)
      throw e
    }
  }

  public async downloadLink({ provider, ...payload }: DownloadLinkPayload) {
    try {
      return await this.usingService(provider).downloadLink(payload)
    } catch (e: any) {
      this.logger.error(`Error download link by ${provider} ${e?.message}`)
      throw e
    }
  }

  public async removeSteam({ provider, ...payload }: RemoveSteamPayload) {
    try {
      return await this.usingService(provider).removeSteam(payload)
    } catch (e: any) {
      this.logger.error(`Error remove steam by ${provider} ${e?.message}`)
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
