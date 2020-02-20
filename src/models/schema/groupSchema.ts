import { createSchema, Type, typedModel, ExtractDoc,  } from 'ts-mongoose';

export interface IGroupUser  {
  isAdmin: boolean,
  userId?: string,
  groupId?: string,
}

const ProductSchema = createSchema({
  userId: Type.string(),
  productIds: Type.array().of(Type.string())
})

const GroupSchema = createSchema({
  name: Type.string({ required: true }),
  description: Type.string({ required: true }),

  users: Type.array({ required: true }).of({
    isAdmin: Type.boolean({ required: true }),
    userId: Type.string(),
    groupId: Type.string()
  }),

  products: Type.array({ required: true }).of(ProductSchema)

})

export type GroupDoc = ExtractDoc<typeof GroupSchema>;
export default typedModel("Group", GroupSchema)