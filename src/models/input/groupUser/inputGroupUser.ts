import { IsString } from 'class-validator'

export class InputGroupUser {
  @IsString({ each: true })
  userIds: (string)[]
}