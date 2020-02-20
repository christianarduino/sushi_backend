import { IsString, IsOptional, IsObject } from 'class-validator'

export class InputGroup {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString({each: true})
  userIds: string[]
}