import { Controller, Get, Post, Patch, Delete, Param, Body, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import { SaveAppDto } from '../dto/app.dto'
import { ResponseSerializerInterceptor } from '../interceptor/response-serializer.interceptor'

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @UseInterceptors(ResponseSerializerInterceptor)
  findMany() {
    return this.appService.findMany()
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
