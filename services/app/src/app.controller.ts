import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseInterceptors } from '@nestjs/common'
import { ResponseSerializerInterceptor, QueryAppDto, SaveAppDto } from '@service/core'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('app')
@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @UseInterceptors(ResponseSerializerInterceptor)
  findMany(@Query() queryAppDto: QueryAppDto) {
    return this.appService.findMany(queryAppDto)
  }

  @Get('/:id')
  @UseInterceptors(ResponseSerializerInterceptor)
  findById(@Param('id') id: string) {
    return this.appService.findById(id)
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

  @Delete('/:id')
  deleteById(@Param('id') id: string) {
    return this.appService.deleteById(id)
  }
}
