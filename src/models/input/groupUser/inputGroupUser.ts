import { IsString } from 'class-validator'
import mongoose from 'mongoose'

export class InputGroupUser {
  @IsString({ each: true })
  userIds: (string)[]

  objectIds: (mongoose.Types.ObjectId)[]
}