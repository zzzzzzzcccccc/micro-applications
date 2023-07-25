import { Injectable } from '@nestjs/common'
import { ERROR_MESSAGE } from '../constants'
import * as minio from 'minio'

@Injectable()
export class MinioService {
  private client: minio.Client

  public async createBucket(name: string, metadata: Record<string, any> = {}) {
    const error = MinioService.validateMetadata(metadata)
    if (error) {
      return Promise.reject(new Error(error))
    }
    const client = this.createClient(metadata.client_options)
    const bucketExists = await client.bucketExists(name)
    if (bucketExists) {
      return Promise.reject(new Error(ERROR_MESSAGE.BUCKET_ALREADY_EXISTS))
    }
    await client.makeBucket(name)
  }

  private static validateMetadata(metadata: Record<string, any>) {
    if (!metadata.client_options) {
      return ERROR_MESSAGE.MISSING_CLIENT_OPTIONS
    }
    return ''
  }

  private createClient(options: minio.ClientOptions) {
    if (!this.client) {
      this.client = new minio.Client(options)
    }
    return this.client
  }
}
