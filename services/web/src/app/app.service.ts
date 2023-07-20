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
import { REDIS_QUERY_FIND_MANY_MAX_TIME } from '../constants'
import { AppStatus, AppMode, AppFrame } from '../enums'

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService')

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  public async findMany(queryAppDto: QueryAppDto) {
    const key = ['app', ...serializeKeysAndValues(queryAppDto)].join(':')
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
    const { status, mode, name, frame } = queryAppDto
    const where: Prisma.appWhereInput = {
      name: {
        contains: name,
      },
    }
    const [statusList, modeList, frameList] = [
      serializeToArray<AppStatus>(status),
      serializeToArray<AppMode>(mode),
      serializeToArray<AppFrame>(frame),
    ]
    statusList.length && (where.status = statusList.length === 1 ? statusList[0] : { in: statusList })
    modeList.length && (where.mode = modeList.length === 1 ? modeList[0] : { in: modeList })
    frameList.length && (where.frame = frameList.length === 1 ? frameList[0] : { in: frameList })

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

  private removeFindManyCache() {
    const key = 'app:*'
    try {
      this.redisService.del(key)
    } catch (e: any) {
      this.logger.error(`removeFindManyCache ${key}:[${e?.message}]`)
    }
  }
}
