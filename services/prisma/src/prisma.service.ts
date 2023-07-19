import { Logger, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '../prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger('PrismaService')

  constructor() {
    super({
      log: ['error', 'info', 'query', 'warn'] as any,
    })
  }

  public async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('Prisma connected')
    } catch (e: any) {
      this.logger.error(`Prisma connect failed:[${e?.message}]`)
    }
  }

  public async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Prisma disconnected')
  }
}
