import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@service/prisma'
import { StorageProviderService } from './provider/storage-provider.service'
import { StorageStatus } from '@service/core'
import { ERROR_MESSAGE } from './constants'

@Injectable()
export class StorageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageProviderService: StorageProviderService,
  ) {}

  public findActive(tenant_id: string) {
    return this.prismaService.storage.findFirst({
      where: {
        tenant_id,
        status: StorageStatus.ACTIVE,
      },
    })
  }

  public async createBucket(tenant_id: string) {
    const storage = await this.findActive(tenant_id)
    if (!storage) {
      throw new HttpException(ERROR_MESSAGE.MISSING_ACTIVE_STORAGE, HttpStatus.NOT_FOUND)
    }
    try {
      return await this.storageProviderService.createBucket(
        storage.provider,
        `${tenant_id}-microservice`,
        storage.metadata as Record<string, any>,
      )
    } catch (e: any) {
      throw new HttpException(
        [ERROR_MESSAGE.BUCKET_ALREADY_EXISTS, ERROR_MESSAGE.MISSING_CLIENT_OPTIONS].includes(e?.message || '')
          ? e.message
          : ERROR_MESSAGE.CREATE_BUCKET_FAILED,
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
