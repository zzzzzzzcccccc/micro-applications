import { IsNotEmpty, Length, IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { FeatureStatus } from '../enums'

export class QueryFeatureDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 50)
  tenant_id: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 100)
  name?: string

  @IsEnum(FeatureStatus)
  @IsOptional()
  status?: FeatureStatus
}

export class SaveFeatureDto<T = null> {
  @IsOptional()
  id?: string

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Length(1, 50)
  tenant_id: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 100)
  name: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 255)
  value: string

  @IsEnum(FeatureStatus)
  @IsOptional()
  status?: FeatureStatus

  @IsOptional()
  metadata?: T
}
