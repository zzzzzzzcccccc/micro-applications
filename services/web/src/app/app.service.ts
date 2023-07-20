import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from '../redis/redis.service'
import { PrismaService } from '@service/prisma'
import { SaveAppDto, QueryAppDto } from '../dto/app.dto'
import { serializeKeysAndValues, serializeJsonParse, serializeJsonString, serializeData } from '../util/serialize'

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService')
  private readonly findManyMaxCacheTime = process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
    ? +process.env.REDIS_QUERY_FIND_MANY_MAX_TIME
    : 3600

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  public async findMany(queryAppDto: QueryAppDto) {
    const { status, mode, name, frame } = queryAppDto
    const key = ['app', ...serializeKeysAndValues(queryAppDto)].join(':')
    const cache = await this.redisService.get(key)
    if (cache) {
      return serializeJsonParse(cache, [])
    }
    const apps = await this.prismaService.app.findMany({
      where: {
        name: {
          contains: name,
        },
        mode,
        status,
        frame,
      },
    })
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
      this.redisService.set(key, value, 'EX', this.findManyMaxCacheTime)
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
