import { Injectable, Logger } from '@nestjs/common'
import { MinioService } from './minio.service'
import { StorageProvider } from '@service/core'
import {
  CreateBucketPayload,
  UploadStreamPayload,
  DownloadLinkPayload,
  ReadSteamPayload,
  RemoveStreamPayload,
} from './types'

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

  public async uploadStream({ provider, ...payload }: UploadStreamPayload) {
    try {
      return await this.usingService(provider).uploadStream(payload)
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

  public async readStream({ provider, ...payload }: ReadSteamPayload) {
    try {
      return await this.usingService(provider).readStream(payload)
    } catch (e: any) {
      this.logger.error(`Error read stream by ${provider} ${e?.message}`)
      throw e
    }
  }

  public async removeStream({ provider, ...payload }: RemoveStreamPayload) {
    try {
      return await this.usingService(provider).removeStream(payload)
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
