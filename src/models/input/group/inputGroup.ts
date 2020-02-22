import { IsString, IsOptional } from 'class-validator'

export class InputGroup {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString({each: true})
  userIds: string[]
}