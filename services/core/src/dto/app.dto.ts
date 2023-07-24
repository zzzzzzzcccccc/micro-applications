import { IsNotEmpty, Length, Max, IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { AppMode, AppStatus, AppFrame } from '../enums'

export class QueryAppDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 100)
  @IsOptional()
  name?: string

  @IsEnum(AppMode, { each: true })
  @IsOptional()
  mode?: AppMode | AppMode[]

  @IsEnum(AppStatus, { each: true })
  @IsOptional()
  status?: AppStatus | AppStatus[]
}

export class SaveAppDto<T = null> {
  @IsOptional()
  id?: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 100)
  name: string

  @Transform(({ value }) => value.trim())
  @Max(100)
  @IsOptional()
  path?: string

  @IsEnum(AppMode)
  @IsOptional()
  mode?: AppMode

  @IsEnum(AppStatus)
  @IsOptional()
  status?: AppStatus

  @IsEnum(AppFrame)
  @IsOptional()
  frame?: AppFrame

  @IsOptional()
  metadata?: T
}
