import { IsNotEmpty, Length, Max, IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { AppModeEnums, AppStatus } from '../enums'

export class SaveAppDto<T = null> {
  @IsOptional()
  id?: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(1, 255)
  name: string

  @Transform(({ value }) => value.trim())
  @Max(255)
  @IsOptional()
  path?: string

  @IsEnum(AppModeEnums)
  @IsOptional()
  mode?: AppModeEnums

  @IsEnum(AppStatus)
  @IsOptional()
  status?: AppStatus

  @IsOptional()
  metadata?: T
}
