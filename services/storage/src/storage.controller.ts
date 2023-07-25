import { Controller, Post, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StorageService } from './storage.service'

@ApiTags('storage')
@Controller('/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('/create-bucket/:tenant_id')
  public createBucket(@Param('tenant_id') tenant_id: string) {
    return this.storageService.createBucket(tenant_id)
  }
}
