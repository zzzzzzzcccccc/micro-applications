import { Controller, Get, Post, Query, UseInterceptors, Body, Patch, Param, Delete } from '@nestjs/common'
import { ResponseSerializerInterceptor, QueryFeatureDto, SaveFeatureDto } from '@service/core'
import { ApiTags } from '@nestjs/swagger'
import { FeatureService } from './feature.service'

@ApiTags('feature')
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get('/')
  @UseInterceptors(ResponseSerializerInterceptor)
  findMany(@Query() queryFeatureDto: QueryFeatureDto) {
    return this.featureService.findMany(queryFeatureDto)
  }

  @Get('/:tenant_id/:id')
  @UseInterceptors(ResponseSerializerInterceptor)
  findById(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.featureService.findById(id, tenant_id)
  }

  @Post('/')
  @UseInterceptors(ResponseSerializerInterceptor)
  create(@Body() saveFeatureDto: SaveFeatureDto) {
    return this.featureService.save(saveFeatureDto)
  }

  @Patch('/:id')
  @UseInterceptors(ResponseSerializerInterceptor)
  update(@Param('id') id: string, @Body() saveFeatureDto: SaveFeatureDto) {
    return this.featureService.save({ ...saveFeatureDto, id })
  }

  @Delete('/:tenant_id/:id')
  deleteById(@Param('tenant_id') tenant_id: string, @Param('id') id: string) {
    return this.featureService.deleteById(id, tenant_id)
  }
}
