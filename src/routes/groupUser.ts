import express, { Router } from 'express'
import { InputGroupUser } from "../models/input/groupUser/inputGroupUser"
import { plainToClass } from "class-transformer"
import { validateOrReject } from "class-validator"
import GroupSchema, { IGroupUser } from "../models/schema/groupSchema"
import UserSchema from "../models/schema/userSchema"

// ROUTE: group/user
const router: Router = express.Router()

//get all users who are not part of a group
/* router.get("/not/:groupId", async (req: express.Request, res: express.Response) => {
  if(!req.params.groupId) return res.status(400).json({ error: true, message: "No groupId params found" })

  const group = await GroupSchema.findById(req.params.groupId)

  if(!group) return res.status(404).json({ error: true, message: "No group with this id was found" })

  const userIds: (string)[] = []
  for(const user of group.users) {
    userIds.push(user.userId!)
  }

}) */

router.get("/search", async (req: express.Request, res: express.Response) => {
  if(!req.query.term || !req.query.userId)
    return res.status(400).json({ error: true, message: "Bad request, no data found" })

  try {
    var regexp = new RegExp(req.query.term);
    const users = await UserSchema.find({ _id: { $ne: req.query.userId }, username: { $regex: regexp } }).select("_id name surname username");
    return res.json({ error: false, users })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: true, message: "Internal error" })
  }
})

//get group of a relative user
router.get("/:userId", async (req: express.Request, res: express.Response) => {
  try {
    const id: string = req.params.userId
    const user = await UserSchema.findById(id)

    if (!user) return res.status(404).json({ error: true, message: "No user was found with this id" })

    const admin = []
    const member = []

    for (const searchGroup of user.groups) {
      const group = await GroupSchema.findById(searchGroup.groupId).select("_id name description")

      if (group) {
        searchGroup.isAdmin ? admin.push(group) : member.push(group)
      }
    }

    res.json({ error: false, admin, member })

  } catch (e) {
    return res.status(500).json({ error: true })
  }
})

//insert new users in a group
router.post("/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const group = await GroupSchema.findById(req.params.groupId)

    if (!group) return res.status(404).json({ error: true, message: "The id sent doesn't match any group" })

    const inputGroupUser = plainToClass(InputGroupUser, req.body)

    try {
      await validateOrReject(inputGroupUser)
    } catch (error) {
      return res.status(400).json({ error: true, message: error })
    }

    for (const id of inputGroupUser.userIds) {
      const user = await UserSchema.findById(id)

      if (user) {
        const newUser: IGroupUser = {
          isAdmin: false,
        }

        //save to group document
        group.users.push({ ...newUser, userId: id })

        //save to the user documento
        user.groups.push({ ...newUser, groupId: group.id })
        await user.save()
      }
    }
    await group.save()

    return res.json({ error: false, message: "The group was updated" })
  } catch (e) {
    return res.status(500).json({ error: true })
  }
})

//delete users from a group
router.delete("/:groupId", async (req: express.Request, res: express.Response) => {
  if (!req.body.userIds || req.body.userIds.length == 0)
    return res.status(400).json({ error: true, message: "No valid data" })

  const inputGroupUser: InputGroupUser = plainToClass(InputGroupUser, req.body)

  try {
    await validateOrReject(inputGroupUser)
  } catch (err) {
    return res.status(400).json({ error: true, message: err })
  }

  try {
    const group = await GroupSchema.findById(req.params.groupId)

    if (!group) return res.status(404).json({ error: true, message: "No group with this id was found" })

    for (const id of inputGroupUser.userIds) {
      const user = await UserSchema.findById(id)

      if (user) {
        user.groups = user.groups.filter(data => data.groupId != group.id)
        await user.save()
        group.users = group.users.filter(groupUser => groupUser.userId != id)
      }
    }

    await group.save()

    let message: string

    if (inputGroupUser.userIds.length == 1) {
      message = "The user has been successfully deleted"
    } else {
      message = "Users have been successfully deleted"
    }

    return res.json({ error: true, message })

  } catch (e) {
    return res.status(500).json({ error: true })
  }

})

export default router