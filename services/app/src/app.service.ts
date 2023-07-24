import { Injectable } from '@nestjs/common'
import { PrismaService, Prisma } from '@service/prisma'
import { QueryAppDto, SaveAppDto, serialize, AppStatus, AppMode } from '@service/core'

const { serializeToArray } = serialize

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findMany(queryAppDto: QueryAppDto) {
    return this.prismaService.app.findMany({ where: AppService.buildFindManyWhere(queryAppDto) })
  }

  public findById(id: string) {
    return this.prismaService.app.findUnique({ where: { id: BigInt(id) } })
  }

  public save(payload: SaveAppDto) {
    return payload.id ? this.update(payload) : this.create(payload)
  }

  public deleteById(id: string) {
    return this.prismaService.app.delete({ where: { id: BigInt(id) } })
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
}
