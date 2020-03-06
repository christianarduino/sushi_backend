import express from 'express'
import  mongoose from 'mongoose'

import UserSchema from "../models/schema/userSchema"
import GroupSchema, { IGroupUser } from "../models/schema/groupSchema"
import { plainToClass } from "class-transformer"
import { validateOrReject } from "class-validator"
import { InputGroupUser } from "../models/input/groupUser/inputGroupUser"

//ROUTE: /group/pending
const router = express.Router()

//get pending users
router.get("/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const id: string = req.params.groupId

    const group = await GroupSchema.findById(id)
    if(!group)
      return res.status(404).json({ error: true, message: "No group found with this id" })
      
    const users = await UserSchema.find({
      _id: { $in: group.pending }
    })

    return res.json({ error: false, users })

  } catch(e) {
    console.log(e)
    return res.status(500).json({ error: true, message: "Internal server error" })
  }
})

//send pending request
router.post("/send", async (req: express.Request, res: express.Response) => {
  console.log(req.body)
  if(!req.body.groupId || !req.body.userId)
    return res.status(400).json({ error: true, message: "Bad request, no data found" })

  try {
    const group = await GroupSchema.findById(req.body.groupId)
    if(!group)
      return res.status(404).json({ error: true, message: "No group found with this id" })

    const user = await UserSchema.findById(req.body.userId)
    if(!user)
      return res.status(404).json({ error: true, message: "No group found with this id" })

    group.pending.push(user.id)
    await group.save()

    return res.json({ error: false, message: "Request sended" })

  } catch(e) {
    console.log(e)
    return res.status(500).json({ error: true, message: "Internal server error" })
  }
})

//insert new users in a group
router.post("/add/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const group = await GroupSchema.findById(req.params.groupId)

    if (!group) return res.status(404).json({ error: true, message: "The id sent doesn't match any group" })

    console.log(req.body)
    const inputGroupUser = plainToClass(InputGroupUser, req.body)

    try {
      await validateOrReject(inputGroupUser)
      inputGroupUser.objectIds = inputGroupUser
        .userIds
        .map(id => mongoose.Types.ObjectId(id))

    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: true, message: "Internal error" })
    }

    const users = await UserSchema.find({ _id: { $in: inputGroupUser.objectIds } })

    const userGroups = users.map<IGroupUser>(user => {
      return { isAdmin: false, userId: user.id }
    })

    group.users = [...group.users, ...userGroups]

    await group.save()
    await group.updateOne({ $pull: { pending: { $in: inputGroupUser.objectIds } }  })

    return res.json({ error: false, message: "The group was updated" })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: true, message: "Internal error" })
  }
})

export default router