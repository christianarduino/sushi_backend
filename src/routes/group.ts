import express, { response } from "express"
import { InputGroup } from "../models/input/inputGroup"
import { plainToClass } from "class-transformer"
import { validateOrReject } from "class-validator"
import GroupSchema, { GroupDoc } from "../models/schema/groupSchema"
import UserSchema from "../models/schema/userSchema"

const router: express.Router = express.Router()

//create new group
router.post("/:userId", async (req: express.Request, res: express.Response) => {
  const loggedUser = await UserSchema.findById(req.params.userId)
  if (!loggedUser) return res.status(400).json({ error: true, message: "The id sent doesn't match any user" })

  const inputGroup: InputGroup = plainToClass(InputGroup, req.body)

  try {
    await validateOrReject(inputGroup)
  } catch (error) {
    console.log("Errore")
    return res.status(400).json({ error: true, message: error.message })
  }

  try {
    const group = await GroupSchema.find({ name: inputGroup.name })
    if (group.length > 0) {
      return res.status(400).json({ error: true, message: "A group with this name already exists" })
    }
  
    //create new group
    const newGroup: GroupDoc = new GroupSchema({
      name: inputGroup.name,
      description: inputGroup.description || "Il sushi è come l'alcool: quando ti alzi dalla tavola dici che sarà l'ultima volta. Ma poi...",
      users: [],
      products: []
    })

    //save new group
    const savedGroup: GroupDoc = await newGroup.save()

    const members: { userId?: string, groupId?: string, isAdmin: boolean }[] = []

    if (inputGroup.userIds.length > 0) {

      members.push({
        isAdmin: true,
        userId: req.params.userId,
      })

      loggedUser.groups.push({
        isAdmin: true,
        groupId: savedGroup.id
      })

      await loggedUser.save()


      for (const id of inputGroup.userIds) {
        members.push({
          isAdmin: false,
          userId: req.params.userId,
        })
        const user = await UserSchema.findById(id)

        user?.groups.push({
          isAdmin: true,
          groupId: savedGroup.id
        })

        await user?.save()
      }
    }

    savedGroup.users = members
    await savedGroup.save()

    return res.json({ error: false, group: savedGroup })

  } catch(e) {
    return res.status(500).json({ error: true , message: e})
  }
})

//get all groups
router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const groups: (GroupDoc)[] = await GroupSchema.find()

    res.json({ error: false, groups })
  } catch(e) {
    return res.status(500).json({ error: true, message: e })
  }
})

//get one group
router.get("/:groupId", async (req: express.Request, res: express.Response) => {

})

//delete group
router.delete("/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const group = await GroupSchema.findById(req.params.groupId)
    if(!group) return res.status(404).json({ error: true, message: "No group was found with this id" })

    for(const groupUser of group!.users) {
      const user = await UserSchema.findById(groupUser.userId)
      user!.groups = user!.groups.filter((group) => group.groupId != groupUser.groupId)
      await user!.save()
    }

    await GroupSchema.deleteOne(req.params.groupId)
    return res.json({ error: false, message: "The group has been successfully deleted" })

  } catch(e) {
    return res.status(500).json({ error: true, message: e })
  }
})

export default router