import { createSchema, Type, typedModel, ExtractDoc, ExtractProps } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true }),
  surname: Type.string({ required: true }),
  username: Type.string({ required: true }),
  email: Type.string({ required: true }),
  password: Type.string({ required: true }),
  groups: Type.array({ required: true }).of({
    userId: Type.string(),
    groupId: Type.string(),
    isAdmin: Type.boolean({ required: true })
  })
})

export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>;
export default typedModel("User", UserSchema)