import { IsString, IsOptional } from 'class-validator'

export class InputGroupModify {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string
}