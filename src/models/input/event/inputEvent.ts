import { IsString } from 'class-validator'

export enum MealsType {
  lunch = "launch",
  dinner = "dinner"
}

export class InputEvent {
  
  @IsString()
  mealsType: string

  @IsString()
  restaurantId: string
}