import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import normalize from 'normalize-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true }),
  surname: Type.string({ required: true }),
  username: Type.string({ required: true }),
  email: Type.string({ required: true }),
  password: Type.string({ required: true }),
  groups: Type.array({ required: true }).of({
    isAdmin: Type.boolean({ required: true }),
    userId: Type.string(),
    groupId: Type.string()
  })
})

UserSchema.plugin(normalize)

export type UserDoc = ExtractDoc<typeof UserSchema>
export default typedModel("User", UserSchema)