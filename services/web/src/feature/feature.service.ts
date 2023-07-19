import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@service/prisma'
import { RedisService } from '../redis/redis.service'
import { QueryFeatureDto, SaveFeatureDto } from '../dto/feature.dto'
import { serializeData } from '../util/serialize'

@Injectable()
export class FeatureService {
  private readonly findManyMaxCacheTime = 3600
  private readonly logger: Logger = new Logger('FeatureService')

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  public async findMany({ tenant_id, status, name }: QueryFeatureDto) {
    const key = `feature:${tenant_id}:${status}:${name}`
    const cache = await this.redisService.get(key)

    if (cache) {
      return JSON.parse(cache)
    }

    const features = await this.prismaService.feature.findMany({
      where: {
        tenant_id,
        name: {
          contains: name,
        },
        status,
      },
    })

    this.setFindManyCache(key, JSON.stringify(serializeData(features)))

    return features
  }

  public findById(id: string, tenant_id: string) {
    return this.prismaService.feature.findUnique({ where: { id: BigInt(id), tenant_id } })
  }

  public async save(payload: SaveFeatureDto) {
    let result

    if (payload.id) {
      result = await this.update(payload)
    } else {
      result = await this.create(payload)
    }
    this.removeFindManyCache(`feature:${payload.tenant_id}:*`)
    return result
  }

  public async deleteById(id: string, tenant_id: string) {
    const result = await this.prismaService.feature.delete({ where: { id: BigInt(id), tenant_id } })
    this.removeFindManyCache(`feature:${tenant_id}:*`)
    return result
  }

  private create(payload: SaveFeatureDto) {
    return this.prismaService.feature.create({ data: payload } as any)
  }

  private update({ id, ...context }: SaveFeatureDto) {
    return this.prismaService.app.update({
      data: { ...context } as any,
      where: { id: BigInt(id as string) },
    })
  }

  private async setFindManyCache(key: string, value: string) {
    try {
      await this.redisService.set(key, value, 'EX', this.findManyMaxCacheTime)
    } catch (e: any) {
      this.logger.error(`setFindManyCache ${key}:[${e?.message}]`)
    }
  }

  private async removeFindManyCache(key: string) {
    try {
      await this.redisService.del(key)
    } catch (e: any) {
      this.logger.error(`removeFindManyCache ${key}:[${e?.message}]`)
    }
  }
}
