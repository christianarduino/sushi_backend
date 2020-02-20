import { createSchema, Type, typedModel, ExtractDoc, ExtractProps } from 'ts-mongoose';

const ProductSchema = createSchema({
  userId: Type.string(),
  productIds: Type.array().of(Type.string())
})

const GroupSchema = createSchema({
  name: Type.string({ required: true }),
  description: Type.string({ required: true }),
  
  users: Type.array({ required: true }).of({
    userId: Type.string(),
    groupId: Type.string(),
    isAdmin: Type.boolean({ required: true })
  }),

  products: Type.array({ required: true }).of(ProductSchema)

})

export type GroupDoc = ExtractDoc<typeof GroupSchema>;
export default typedModel("Group", GroupSchema)