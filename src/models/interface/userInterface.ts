import { IsString, IsEmail, MinLength } from 'class-validator'

export class RegisterUser {

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

export class LoginUser {
  
  @IsString()
  username: string

  @IsString()
  password: string
}