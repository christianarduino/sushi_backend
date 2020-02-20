import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import GroupSchema from './groupEntity';

const UserSchema = createSchema({
  name: Type.string({required: true}),
  surname: Type.string({required: true}),
  username: Type.string({required: true}),
  email: Type.string({required: true}),
  password: Type.string({required: true}),
  groups: Type.array().of({
    id: Type.string(),
    isAdmin: Type.boolean()
  })
})

export type UserDoc = ExtractDoc<typeof UserSchema>;
export default typedModel("User", UserSchema)