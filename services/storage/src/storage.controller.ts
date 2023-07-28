import { Controller, Post, Get, Delete, Body, Param, UploadedFile, UseInterceptors, Res } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { StorageFileDto, serialize } from '@service/core'
import { StorageService } from './storage.service'

@ApiTags('storage')
@Controller('/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('/create-bucket/:tenant_id')
  public createBucket(@Param('tenant_id') tenant_id: string) {
    return this.storageService.createBucket(tenant_id)
  }

  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @Post('/upload/:tenant_id')
  public uploadStream(@Param('tenant_id') tenant_id: string, @UploadedFile() file: StorageFileDto, @Body() body: any) {
    return this.storageService.uploadStream(tenant_id, file, body?.metadata)
  }

  @Get('/download-link/:tenant_id/:id')
  public downloadLink(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.storageService.downloadLink(tenant_id, id)
  }

  @Get('/:tenant_id/:id')
  public findById(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.storageService.findById(tenant_id, id)
  }

  @Get('/read/:tenant_id/:id')
  public async readStream(
    @Param('tenant_id') tenant_id: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) response: any,
  ) {
    const { stream, file } = await this.storageService.readStream(tenant_id, id)
    response.set(serialize.serializeFileHeaders(file.name, file.mime_type || '', file.size))
    return stream
  }

  @Delete('/:tenant_id/:id')
  public removeStream(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.storageService.removeStream(tenant_id, id)
  }
}
