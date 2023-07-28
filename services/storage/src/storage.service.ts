import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common'
import { PrismaService } from '@service/prisma'
import { StorageProviderService } from './provider/storage-provider.service'
import { StorageStatus, StorageFileDto, serialize } from '@service/core'
import { ERROR_MESSAGE } from './constants'
import { v4 as uuid } from 'uuid'

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

  public async findById(tenant_id: string, id: string) {
    const storageFile = await this.prismaService.storage_file.findUnique({
      where: {
        id: BigInt(id),
        tenant_id,
      },
    })
    return serialize.serializeData(storageFile)
  }

  public async createBucket(tenant_id: string) {
    const storage = await this.findActive(tenant_id)
    if (!storage) {
      throw new HttpException(ERROR_MESSAGE.MISSING_ACTIVE_STORAGE, HttpStatus.NOT_FOUND)
    }
    try {
      return await this.storageProviderService.createBucket({
        provider: storage.provider,
        metadata: storage.metadata as Record<string, any>,
      })
    } catch (e: any) {
      throw StorageService.getErrorHttpException(e, ERROR_MESSAGE.CREATE_BUCKET_FAILED)
    }
  }

  public async uploadStream(tenant_id: string, file: StorageFileDto, metadata: string) {
    const storage = await this.findActive(tenant_id)
    const { originalname = uuid().replace(/-/g, ''), mimetype, buffer, size } = file
    if (!storage) {
      throw new HttpException(ERROR_MESSAGE.MISSING_ACTIVE_STORAGE, HttpStatus.NOT_FOUND)
    }
    return this.prismaService.$transaction(async (client) => {
      try {
        const record = await client.storage_file.create({
          data: {
            tenant_id,
            name: originalname,
            size,
            mime_type: mimetype,
            metadata: serialize.serializeJsonParse<any>(metadata, null),
          },
        })
        const file = serialize.serializeData(record)
        await this.storageProviderService.uploadStream({
          provider: storage.provider,
          metadata: storage.metadata as Record<string, any>,
          objectName: `${file.id}/${originalname}`,
          name: originalname,
          steam: buffer,
          size,
          type: mimetype,
        })
        return file
      } catch (e) {
        throw StorageService.getErrorHttpException(e, ERROR_MESSAGE.UPLOAD_STEAM_FAILED)
      }
    })
  }

  public async downloadLink(tenant_id: string, id: string) {
    const storage = await this.findActive(tenant_id)
    if (!storage) {
      throw new HttpException(ERROR_MESSAGE.MISSING_ACTIVE_STORAGE, HttpStatus.NOT_FOUND)
    }
    const file = await this.findById(tenant_id, id)
    if (!file) {
      throw new HttpException(ERROR_MESSAGE.MISSING_STORAGE_FILE, HttpStatus.NOT_FOUND)
    }
    try {
      return await this.storageProviderService.downloadLink({
        provider: storage.provider,
        metadata: storage.metadata as Record<string, any>,
        name: file.name as string,
        objectName: `${file.id}/${file.name}`,
        type: file.mime_type as string,
        size: file.size,
      })
    } catch (e) {
      throw StorageService.getErrorHttpException(e, ERROR_MESSAGE.DOWNLOAD_LINK_FAILED)
    }
  }

  public async readStream(tenant_id: string, id: string) {
    const storage = await this.findActive(tenant_id)
    if (!storage) {
      throw new HttpException(ERROR_MESSAGE.MISSING_ACTIVE_STORAGE, HttpStatus.NOT_FOUND)
    }
    const file = await this.findById(tenant_id, id)
    if (!file) {
      throw new HttpException(ERROR_MESSAGE.MISSING_STORAGE_FILE, HttpStatus.NOT_FOUND)
    }
    try {
      const record = await this.storageProviderService.readStream({
        provider: storage.provider,
        metadata: storage.metadata as Record<string, any>,
        objectName: `${file.id}/${file.name}`,
      })
      return {
        stream: new StreamableFile(record),
        file,
      }
    } catch (e) {
      throw StorageService.getErrorHttpException(e, ERROR_MESSAGE.READ_STEAM_FAILED)
    }
  }

  public async removeStream(tenant_id: string, id: string) {
    const storage = await this.findActive(tenant_id)
    if (!storage) {
      throw new HttpException(ERROR_MESSAGE.MISSING_ACTIVE_STORAGE, HttpStatus.NOT_FOUND)
    }
    const file = await this.findById(tenant_id, id)
    if (!file) {
      throw new HttpException(ERROR_MESSAGE.MISSING_STORAGE_FILE, HttpStatus.NOT_FOUND)
    }
    try {
      await this.storageProviderService.removeStream({
        provider: storage.provider,
        metadata: storage.metadata as Record<string, any>,
        objectName: `${file.id}/${file.name}`,
      })
      await this.prismaService.storage_file.delete({
        where: {
          id: BigInt(id),
        },
      })
    } catch (e) {
      throw StorageService.getErrorHttpException(e, ERROR_MESSAGE.REMOVE_STEAM_FAILED)
    }
  }

  private static getErrorHttpException(e: any, message: string, status = HttpStatus.BAD_REQUEST) {
    return new HttpException(
      [
        ERROR_MESSAGE.MISSING_BUCKET_NAME,
        ERROR_MESSAGE.BUCKET_ALREADY_EXISTS,
        ERROR_MESSAGE.MISSING_CLIENT_OPTIONS,
      ].includes(e?.message || '')
        ? e.message
        : message,
      status,
    )
  }
}
