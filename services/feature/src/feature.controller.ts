import { Controller, Get, Post, Delete, Body, Query, Param, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryFeatureDto, SaveFeatureDto, ResponseSerializerInterceptor } from '@service/core'
import { FeatureService } from './feature.service'

@ApiTags('feature')
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get('/:workspace')
  @UseInterceptors(ResponseSerializerInterceptor)
  public findMany(@Param('workspace') workspace: string, @Query() queryFeatureDto: QueryFeatureDto) {
    return this.featureService.findMany(workspace, queryFeatureDto)
  }

  @Post('/:workspace')
  @UseInterceptors(ResponseSerializerInterceptor)
  public save(@Param('workspace') workspace: string, @Body() saveFeatureDto: SaveFeatureDto) {
    return this.featureService.save({ ...saveFeatureDto, workspace })
  }

  @Delete('/:workspace/:id')
  public delete(@Param('workspace') workspace: string, @Param('id') id: string) {
    return this.featureService.deleteById(workspace, id)
  }
}
