import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { SaveAppDto, QueryAppDto } from '../dto/app.dto'
import { ResponseSerializerInterceptor } from '../interceptor/response-serializer.interceptor'

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @UseInterceptors(ResponseSerializerInterceptor)
  findMany(@Query() queryAppDto: QueryAppDto) {
    return this.appService.findMany(queryAppDto)
  }

  @Get('/:tenant_id/:id')
  @UseInterceptors(ResponseSerializerInterceptor)
  findById(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.appService.findById(id, tenant_id)
  }

  @Post('/')
  @UseInterceptors(ResponseSerializerInterceptor)
  create(@Body() saveAppDto: SaveAppDto) {
    return this.appService.save(saveAppDto)
  }

  @Patch('/:id')
  @UseInterceptors(ResponseSerializerInterceptor)
  update(@Param('id') id: string, @Body() saveAppDto: SaveAppDto) {
    return this.appService.save({ ...saveAppDto, id })
  }

  @Delete('/:tenant_id/:id')
  deleteById(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.appService.deleteById(id, tenant_id)
  }
}
