import { Injectable } from '@nestjs/common'
import { PrismaService } from '@service/prisma'
import { SaveAppDto } from '../dto/app.dto'

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  public findMany() {
    return this.prismaService.app.findMany()
  }

  public findById(id: string) {
    return this.prismaService.app.findUnique({ where: { id: BigInt(id) } })
  }

  public save(payload: SaveAppDto) {
    if (payload.id) {
      return this.update(payload)
    }
    return this.create(payload)
  }

  public deleteById(id: string) {
    return this.prismaService.app.delete({ where: { id: BigInt(id) } })
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
}
