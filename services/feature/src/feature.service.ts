import { Injectable } from '@nestjs/common'
import { PrismaService, Prisma } from '@service/prisma'
import { QueryFeatureDto, SaveFeatureDto, serialize, FeatureStatus } from '@service/core'

const { serializeToArray } = serialize

@Injectable()
export class FeatureService {
  constructor(private readonly prismaService: PrismaService) {}

  public findMany(queryFeatureDto: QueryFeatureDto) {
    return this.prismaService.feature.findMany({
      where: FeatureService.buildFindManyWhere(queryFeatureDto),
    })
  }

  public findById(id: string, tenant_id: string) {
    return this.prismaService.feature.findUnique({ where: { id: BigInt(id), tenant_id } })
  }

  public save(saveFeatureDto: SaveFeatureDto) {
    return saveFeatureDto.id ? this.update(saveFeatureDto) : this.create(saveFeatureDto)
  }

  public deleteById(id: string, tenant_id: string) {
    return this.prismaService.feature.delete({ where: { id: BigInt(id), tenant_id } })
  }

  private static buildFindManyWhere(queryFeatureDto: QueryFeatureDto) {
    const { tenant_id, name, status } = queryFeatureDto
    const where: Prisma.featureWhereInput = {
      tenant_id,
      name: {
        contains: name,
      },
    }
    const [statusList] = [serializeToArray<FeatureStatus>(status)]
    statusList.length && (where.status = statusList.length === 1 ? statusList[0] : { in: statusList })
    return where
  }

  private create(payload: SaveFeatureDto) {
    return this.prismaService.feature.create({ data: payload } as any)
  }

  private update({ id, ...context }: SaveFeatureDto) {
    return this.prismaService.app.update({
      data: { ...context } as any,
      where: { id: BigInt(id as string) },
    })
  }
}
