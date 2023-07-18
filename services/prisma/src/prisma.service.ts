import { Logger, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '../prisma/client'

const logger = new Logger('PrismaService')

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'info', 'query', 'warn'] as any,
    })
  }

  public async onModuleInit() {
    try {
      await this.$connect()
      logger.log('prisma connected')
    } catch (e) {
      logger.error(e)
    }
  }

  public async onModuleDestroy() {
    await this.$disconnect()
  }
}
