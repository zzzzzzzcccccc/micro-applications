import { Injectable } from '@nestjs/common'
import { ERROR_MESSAGE, DEFAULT_DOWNLOAD_LINK_EXPIRED } from '../constants'
import * as minio from 'minio'
import { serialize } from '@service/core'
import {
  CreateBucketPayload,
  UploadStreamPayload,
  DownloadLinkPayload,
  ReadSteamPayload,
  RemoveStreamPayload,
} from './types'

@Injectable()
export class MinioService {
  private client: minio.Client

  public async createBucket({ metadata }: Omit<CreateBucketPayload, 'provider'>) {
    const client = this.getClient(metadata)
    if (client instanceof Error) {
      return Promise.reject(client)
    }
    const bucketExists = await client.bucketExists(metadata.bucket_name)
    if (bucketExists) {
      return Promise.reject(new Error(ERROR_MESSAGE.BUCKET_ALREADY_EXISTS))
    }
    await client.makeBucket(metadata.bucket_name)
  }

  public async uploadStream({ objectName, name, size, type, steam, metadata }: Omit<UploadStreamPayload, 'provider'>) {
    const client = this.getClient(metadata)
    if (client instanceof Error) {
      return Promise.reject(client)
    }
    return client.putObject(
      metadata.bucket_name,
      objectName,
      steam,
      size,
      serialize.serializeFileHeaders(name, type, size),
    )
  }

  public async downloadLink({ objectName, name, size, type, metadata }: Omit<DownloadLinkPayload, 'provider'>) {
    const client = this.getClient(metadata)
    if (client instanceof Error) {
      return Promise.reject(client)
    }
    return client.presignedGetObject(
      metadata.bucket_name,
      objectName,
      metadata.download_link_expired || DEFAULT_DOWNLOAD_LINK_EXPIRED,
      serialize.serializeFileHeaders(name, type, size),
    )
  }

  public async readStream({ objectName, metadata }: Omit<ReadSteamPayload, 'provider'>) {
    const client = this.getClient(metadata)
    if (client instanceof Error) {
      return Promise.reject(client)
    }
    return client.getObject(metadata.bucket_name, objectName)
  }

  public async removeStream({ objectName, metadata }: Omit<RemoveStreamPayload, 'provider'>) {
    const client = this.getClient(metadata)
    if (client instanceof Error) {
      return Promise.reject(client)
    }
    return client.removeObject(metadata.bucket_name, objectName)
  }

  private createClient(options: minio.ClientOptions) {
    if (!this.client) {
      this.client = new minio.Client(options)
    }
    return this.client
  }

  private getClient(metadata: Record<string, any>) {
    const error = MinioService.validateMetadata(metadata)
    if (error) {
      return new Error(error)
    }
    return this.createClient(metadata.client_options)
  }

  private static validateMetadata(metadata: Record<string, any>) {
    if (!metadata.bucket_name) {
      return ERROR_MESSAGE.MISSING_BUCKET_NAME
    }
    if (!metadata.client_options) {
      return ERROR_MESSAGE.MISSING_CLIENT_OPTIONS
    }
    return ''
  }
}
