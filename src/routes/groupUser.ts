import express, { Router } from 'express'
import { InputGroupUser } from "../models/input/groupUser/inputGroupUser"
import { plainToClass } from "class-transformer"
import { validateOrReject } from "class-validator"
import GroupSchema from "../models/schema/groupSchema"
import  mongoose from 'mongoose'
import UserSchema from "../models/schema/userSchema"

// ROUTE: group/user
const router: Router = express.Router()


router.get("/add-search", async (req: express.Request, res: express.Response) => {
  console.log("Query", req.query)
  if (!req.query.term || !req.query.userId || !req.query.groupId)
    return res.status(400).json({ error: true, message: "Bad request, no data found" })

  const group = await GroupSchema.findById(req.query.groupId)
  if(!group)
    return res.status(404).json({ error: true, message: "No group found with this id" })
  console.log("Users", group.users.map(user => user.userId))
  //5e5bce6f8ff90207770c803e
  try {
    var regexp = new RegExp(req.query.term);
    const users = await UserSchema.find({  
      _id: { $ne: group.users.map(user => user.userId )}, 
      username: { $regex: regexp } })
      .select("_id name surname username");

    return res.json({ error: false, users })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: true, message: "Internal error" })
  }
})

router.get("/create-search", async (req: express.Request, res: express.Response) => {
  if (!req.query.term || !req.query.userId)
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

    let admin = []
    let member = []

    const groupsAdmin = await GroupSchema.find({
      users: { $elemMatch: { userId: user.id, isAdmin: true } }
    })
    admin = groupsAdmin

    const groupsMember = await GroupSchema.find({
      users: { $elemMatch: { userId: user.id, isAdmin: false } }
    })
    member = groupsMember

    res.json({ error: false, admin, member })

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
    inputGroupUser.objectIds = inputGroupUser.userIds.map(id => mongoose.Types.ObjectId(id))
  } catch (err) {
    return res.status(400).json({ error: true, message: err })
  }

  try {
    const group = await GroupSchema.findById(req.params.groupId)

    if (!group) return res.status(404).json({ error: true, message: "No group with this id was found" })

    const updatedGroup = await GroupSchema.updateOne({_id: group.id}, { $pull: { "users.userId": { $in: inputGroupUser.objectIds } } })

    let message: string

    if (updatedGroup) {
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