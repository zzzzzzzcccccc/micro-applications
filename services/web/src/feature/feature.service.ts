import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@service/prisma'
import { RedisService } from '../redis/redis.service'
import { QueryFeatureDto, SaveFeatureDto } from '../dto/feature.dto'
import { serializeData, serializeJsonString, serializeJsonParse, serializeKeysAndValues } from '../util/serialize'

@Injectable()
export class FeatureService {
  private readonly logger: Logger = new Logger('FeatureService')
  private readonly findManyMaxCacheTime = process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
    ? +process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
    : 3600

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  public async findMany(queryFeatureDto: QueryFeatureDto) {
    const { tenant_id, status, name } = queryFeatureDto
    const key = ['feature', ...serializeKeysAndValues(queryFeatureDto)].join(':')
    const cache = await this.redisService.get(key)

    if (cache) {
      return serializeJsonParse(cache, [])
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

    this.setFindManyCache(key, serializeJsonString(serializeData(features)))

    return features
  }

  public findById(id: string, tenant_id: string) {
    return this.prismaService.feature.findUnique({ where: { id: BigInt(id), tenant_id } })
  }

  public async save(saveFeatureDto: SaveFeatureDto) {
    try {
      const result = saveFeatureDto.id ? await this.update(saveFeatureDto) : await this.create(saveFeatureDto)
      this.removeFindManyCache(saveFeatureDto.tenant_id)
      return result
    } catch (e: any) {
      this.logger.error(`save feature failed ${e?.message}`)
      return null
    }
  }

  public async deleteById(id: string, tenant_id: string) {
    const result = await this.prismaService.feature.delete({ where: { id: BigInt(id), tenant_id } })
    this.removeFindManyCache(tenant_id)
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

  private setFindManyCache(key: string, value: string) {
    try {
      this.redisService.set(key, value, 'EX', this.findManyMaxCacheTime)
    } catch (e: any) {
      this.logger.error(`setFindManyCache ${key}:[${e?.message}]`)
    }
  }

  private removeFindManyCache(tenant_id: string) {
    const key = `feature:${tenant_id}:*`
    try {
      this.redisService.del(key)
    } catch (e: any) {
      this.logger.error(`removeFindManyCache ${key}:[${e?.message}]`)
    }
  }
}
