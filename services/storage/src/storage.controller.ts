import { Controller, Post, Get, Delete, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { StorageFileDto } from '@service/core'
import { StorageService } from './storage.service'

@ApiTags('storage')
@Controller('/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('/create-bucket/:tenant_id')
  public createBucket(@Param('tenant_id') tenant_id: string) {
    return this.storageService.createBucket(tenant_id)
  }

  // @ts-ignore
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @Post('/upload/:tenant_id')
  public upload(@Param('tenant_id') tenant_id: string, @UploadedFile() file: StorageFileDto, @Body() body: any) {
    return this.storageService.uploadSteam(tenant_id, file, body?.metadata)
  }

  @Get('/download-link/:tenant_id/:id')
  public downloadLink(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.storageService.downloadLink(tenant_id, id)
  }

  @Get('/:tenant_id/:id')
  public findById(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.storageService.findById(tenant_id, id)
  }

  @Delete('/:tenant_id/:id')
  public removeSteam(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.storageService.removeSteam(tenant_id, id)
  }
}
