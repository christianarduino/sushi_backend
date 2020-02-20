import { IsString, IsEmail, MinLength } from 'class-validator'

export class InputRegister {

  @IsString()
  name: string

  @IsString()
  surname: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(3)
  username: string

  @IsString()
  @MinLength(4)
  password: string
}

export class InputLogin {
  
  @IsString()
  username: string

  @IsString()
  password: string
}