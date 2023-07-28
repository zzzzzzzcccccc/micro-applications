import { IsNotEmpty, Length, IsEnum, IsOptional, IsNumber, IsArray } from 'class-validator'
import { Transform } from 'class-transformer'
import { FeatureStatus } from '../enums'

export class QueryFeatureDto {
  @IsEnum(FeatureStatus)
  @IsOptional()
  status?: FeatureStatus
}

export class SaveFeatureDto<T = Record<string, any>> {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  id?: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 255)
  name: string

  @IsEnum(FeatureStatus)
  @IsOptional()
  status?: FeatureStatus

  @IsOptional()
  metadata?: T
}
