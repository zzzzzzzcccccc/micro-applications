import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from '../redis/redis.service'
import { PrismaService, Prisma } from '@service/prisma'
import { SaveAppDto, QueryAppDto } from '../dto/app.dto'
import {
  serializeKeysAndValues,
  serializeJsonParse,
  serializeJsonString,
  serializeData,
  serializeToArray,
} from '../util/serialize'
import { REDIS_QUERY_FIND_MANY_MAX_TIME, FIND_APPS_REDIS_TAG } from '../constants'
import { AppStatus, AppMode } from '../enums'

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService')

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  public async findMany(queryAppDto: QueryAppDto) {
    const key = serializeKeysAndValues(queryAppDto).length
      ? [FIND_APPS_REDIS_TAG, ...serializeKeysAndValues(queryAppDto)].join(':')
      : `${FIND_APPS_REDIS_TAG}:ALL`
    const cache = await this.redisService.get(key)
    if (cache) {
      return serializeJsonParse(cache, [])
    }
    const apps = await this.prismaService.app.findMany({ where: AppService.buildFindManyWhere(queryAppDto) })
    this.setFindManyCache(key, serializeJsonString(serializeData(apps)))
    return apps
  }

  public findById(id: string) {
    return this.prismaService.app.findUnique({ where: { id: BigInt(id) } })
  }

  public async save(payload: SaveAppDto) {
    try {
      const result = payload.id ? await this.update(payload) : await this.create(payload)
      this.removeFindManyCache()
      return result
    } catch (e: any) {
      this.logger.error(`save app failed ${e?.message}`)
      return null
    }
  }

  public async deleteById(id: string) {
    const result = await this.prismaService.app.delete({ where: { id: BigInt(id) } })
    this.removeFindManyCache()
    return result
  }

  private static buildFindManyWhere(queryAppDto: QueryAppDto) {
    const { status, mode, name } = queryAppDto
    const where: Prisma.appWhereInput = {
      name: {
        contains: name,
      },
    }
    const [statusList, modeList] = [serializeToArray<AppStatus>(status), serializeToArray<AppMode>(mode)]
    statusList.length && (where.status = statusList.length === 1 ? statusList[0] : { in: statusList })
    modeList.length && (where.mode = modeList.length === 1 ? modeList[0] : { in: modeList })

    return where
  }

  private create(payload: SaveAppDto) {
    return this.prismaService.app.create({ data: payload } as any)
  }

  private update({ id, ...context }: SaveAppDto) {
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

  private async removeFindManyCache() {
    try {
      const keys = await this.redisService.keys(`${FIND_APPS_REDIS_TAG}:*`)
      keys.length && (await this.redisService.del(...keys))
    } catch (e: any) {
      this.logger.error(`removeFindManyCache ${FIND_APPS_REDIS_TAG}:[${e?.message}]`)
    }
  }
}
