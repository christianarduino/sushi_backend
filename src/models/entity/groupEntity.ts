import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const GroupSchema = createSchema({
  id: Type.string,
  isAdmin: Type.boolean
})

export type GroupDoc = ExtractDoc<typeof GroupSchema>;
export default typedModel("Group", GroupSchema)