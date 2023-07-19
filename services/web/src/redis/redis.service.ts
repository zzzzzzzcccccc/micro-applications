import { Logger, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger('RedisService')

  constructor() {
    super({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT!,
      lazyConnect: true,
    } as any)
  }

  public async onModuleInit() {
    try {
      await this.connect()
      this.logger.log('Redis connected')
    } catch (e: any) {
      this.logger.error(`Redis connect failed:[${e?.message}]`)
    }
  }

  public async onModuleDestroy() {
    await this.disconnect()
    this.logger.log('Redis disconnected')
  }
}
