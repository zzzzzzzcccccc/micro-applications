import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger('RedisService')

  constructor() {
    super({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      db: Number(process.env.REDIS_DB),
      lazyConnect: true,
    })
  }

  public async onModuleInit() {
    try {
      await this.connect()
      this.logger.log('Redis connected successfully')
    } catch (e: any) {
      this.logger.error(`Redis connected failed:[${e?.message}]`)
    }
  }

  public async onModuleDestroy() {
    await this.disconnect()
    this.logger.log('Redis disconnected successfully')
  }
}
