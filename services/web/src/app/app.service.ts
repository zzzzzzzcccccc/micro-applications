import { Injectable } from '@nestjs/common'
import { PrismaService } from '@service/prisma'
import { SaveAppDto, QueryAppDto } from '../dto/app.dto'

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  public findMany({ tenant_id, status, mode, name, frame }: QueryAppDto) {
    return this.prismaService.app.findMany({
      where: {
        tenant_id,
        name: {
          contains: name,
        },
        mode,
        status,
        frame,
      },
    })
  }

  public findById(id: string, tenant_id: string) {
    return this.prismaService.app.findUnique({ where: { id: BigInt(id), tenant_id } })
  }

  public save(payload: SaveAppDto) {
    if (payload.id) {
      return this.update(payload)
    }
    return this.create(payload)
  }

  public deleteById(id: string, tenant_id: string) {
    return this.prismaService.app.delete({ where: { id: BigInt(id), tenant_id } })
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
