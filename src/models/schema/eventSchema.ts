import { createSchema, Type, typedModel, ExtractDoc, } from 'ts-mongoose';
import normalize from 'normalize-mongoose';
import { IsString, IsEnum } from 'class-validator'
import { MealsType } from '../input/event/inputEvent'

const EventSchema = createSchema({

  restaurantId: Type.string({ required: true }),
  mealsType: Type.string({ required: true }),
  paymentType: Type.string({ required: true }),
  groupId: Type.string({ required: true }),
  cart: Type.array({ required: true }).of({
    userId: Type.string(),
    products: Type.array().of(Type.string())
  })
})

export default typedModel("Event", EventSchema)