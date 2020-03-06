import { createSchema, Type, typedModel, ExtractDoc,  } from 'ts-mongoose';
import normalize from 'normalize-mongoose'
import mongoose from 'mongoose'

export interface IGroupUser  {
  isAdmin: boolean,
  userId?: mongoose.Types.ObjectId,
  groupId?: mongoose.Types.ObjectId,
}

const ProductSchema = createSchema({
  userId: Type.objectId(),
  productIds: Type.array().of(Type.objectId())
})

const GroupSchema = createSchema({
  name: Type.string({ required: true }),
  description: Type.string({ required: true }),

  users: Type.array({ required: true }).of({
    isAdmin: Type.boolean({ required: true }),
    userId: Type.objectId(),
    groupId: Type.objectId()
  }),

  products: Type.array({ required: true }).of(ProductSchema),

  pending: Type.array({ required: true }).of(Type.string()),

  events: Type.array({ required: true }).of(Type.string())

})

GroupSchema.plugin(normalize)

export type GroupDoc = ExtractDoc<typeof GroupSchema>;

export default typedModel("Group", GroupSchema)