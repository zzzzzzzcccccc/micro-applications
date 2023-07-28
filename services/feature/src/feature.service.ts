import { Injectable } from '@nestjs/common'
import { FeatureStatus, QueryFeatureDto, SaveFeatureDto } from '@service/core'
import { PrismaService } from '@service/prisma'

type SavePayload = SaveFeatureDto & { workspace: string }

@Injectable()
export class FeatureService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findMany(workspace: string, payload: QueryFeatureDto) {
    return this.prismaService.feature.findMany({
      where: {
        workspace,
        ...payload,
      },
    })
  }

  public async save(payload: SavePayload) {
    return payload.id ? this.update(payload) : this.create(payload)
  }

  public create({ status = FeatureStatus.ACTIVE, metadata = {}, ...payload }: SavePayload) {
    return this.prismaService.feature.create({ data: { status, metadata, ...payload } } as any)
  }

  public update({ id, workspace, ...payload }: SavePayload) {
    return this.prismaService.feature.update({ data: payload, where: { id: BigInt(id as string), workspace } } as any)
  }

  public async deleteById(workspace: string, id: string) {
    return this.prismaService.feature.delete({
      where: {
        workspace,
        id: BigInt(id),
      },
    })
  }
}
