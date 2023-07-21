import { Injectable, Logger } from '@nestjs/common'
import { PrismaService, Prisma } from '@service/prisma'
import { RedisService } from '../redis/redis.service'
import { QueryFeatureDto, SaveFeatureDto } from '../dto/feature.dto'
import {
  serializeData,
  serializeJsonString,
  serializeJsonParse,
  serializeKeysAndValues,
  serializeToArray,
} from '../util/serialize'
import { REDIS_QUERY_FIND_MANY_MAX_TIME, FIND_FEATURES_REDIS_TAG } from '../constants'
import { FeatureStatus } from '../enums'

@Injectable()
export class FeatureService {
  private readonly logger: Logger = new Logger('FeatureService')

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  public async findMany(queryFeatureDto: QueryFeatureDto) {
    const { tenant_id, ...context } = queryFeatureDto
    const key = serializeKeysAndValues(context).length
      ? [FIND_FEATURES_REDIS_TAG, tenant_id, ...serializeKeysAndValues(context)].join(':')
      : `${FIND_FEATURES_REDIS_TAG}:${tenant_id}:ALL`
    const cache = await this.redisService.get(key)

    if (cache) {
      return serializeJsonParse(cache, [])
    }

    const features = await this.prismaService.feature.findMany({
      where: FeatureService.buildFindManyWhere(queryFeatureDto),
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

  private static buildFindManyWhere(queryFeatureDto: QueryFeatureDto) {
    const { tenant_id, name, status } = queryFeatureDto
    const where: Prisma.featureWhereInput = {
      tenant_id,
      name: {
        contains: name,
      },
    }
    const [statusList] = [serializeToArray<FeatureStatus>(status)]
    statusList.length && (where.status = statusList.length === 1 ? statusList[0] : { in: statusList })
    return where
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
      this.redisService.set(key, value, 'EX', REDIS_QUERY_FIND_MANY_MAX_TIME)
    } catch (e: any) {
      this.logger.error(`setFindManyCache ${key}:[${e?.message}]`)
    }
  }

  private async removeFindManyCache(tenant_id: string) {
    try {
      const keys = await this.redisService.keys(`${FIND_FEATURES_REDIS_TAG}:${tenant_id}:*`)
      await this.redisService.del(keys)
    } catch (e: any) {
      this.logger.error(`removeFindManyCache ${FIND_FEATURES_REDIS_TAG}:[${e?.message}]`)
    }
  }
}
