import express from "express"
import { InputGroup } from "../models/input/group/inputGroup"
import { InputGroupModify } from "../models/input/group/inputGroupModify"
import { plainToClass } from "class-transformer"
import { validateOrReject } from "class-validator"
import GroupSchema, { GroupDoc, IGroupUser } from "../models/schema/groupSchema"
import UserSchema from "../models/schema/userSchema"

// ROUTE: group/
const router: express.Router = express.Router()

//get all groups
router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const groups: (GroupDoc)[] = await GroupSchema.find()

    res.json({ error: false, groups })
  } catch (e) {
    return res.status(500).json({ error: true, message: e })
  }
})

//search group
router.get("/search", async (req: express.Request, res: express.Response) => {
  console.log(req.query)
  if(!req.query.term || !req.query.userId)
    return res.status(400).json({ error: true, message: "Bad request, no data found" })

  try {
    var regexp = new RegExp(req.query.term);
    const groups = await GroupSchema.find({ users: { $ne: { userId: req.query.userId } }, name: { $regex: regexp } }).select("_id name description");
    return res.json({ error: false, groups })
  } catch(e){
    console.log(e);
    return res.status(500).json({ error: true, message: "Internal error" })
  }
})

//get one group
router.get("/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const group = await GroupSchema.findById(req.params.groupId)
    if (!group) {
      return res.status(404).json({ error: true, message: "No group was found with this id" })
    } else {
      return res.json({ error: false, group })
    }
  } catch (e) {
    return res.status(500).json({ error: true })
  }
})

//create new group
router.post("/:userId", async (req: express.Request, res: express.Response) => {
  
  const loggedUser = await UserSchema.findById(req.params.userId)
  if (!loggedUser) return res.status(400).json({ error: true, message: "The id sent doesn't match any user" })

  const inputGroup: InputGroup = plainToClass(InputGroup, req.body)

  try {
    await validateOrReject(inputGroup)
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message })
  }

  try {
    const group = await GroupSchema.find({ name: inputGroup.name })
    if (group.length > 0) {
      return res.status(400).json({ error: true, message: "A group with this name already exists" })
    }

    //new group
    const newGroup: GroupDoc = new GroupSchema({
      name: inputGroup.name,
      description: inputGroup.description || "Il sushi è come l'alcool: quando ti alzi dalla tavola dici che sarà l'ultima volta. Ma poi...",
      users: [],
      products: [],
      pending: [],
    })

    //save new group
    const savedGroup: GroupDoc = await newGroup.save()

    const members: (IGroupUser)[] = []

    loggedUser.groups.push({
      isAdmin: true,
      groupId: savedGroup.id
    })

    await loggedUser.save()

    if (inputGroup.userIds.length > 0) {

      const newMember: IGroupUser = {
        isAdmin: true,
        userId: req.params.userId
      }

      members.push(newMember)


      for (const id of inputGroup.userIds) {
        const newMember: IGroupUser = {
          isAdmin: false,
          userId: id
        }

        members.push(newMember)
        const user = await UserSchema.findById(id)

        if (user) {
          user.groups.push({
            isAdmin: false,
            groupId: savedGroup.id
          })

          await user.save()
        }
      }
    }

    savedGroup.users = members
    await savedGroup.save()

    return res.json({ error: false, group: savedGroup })

  } catch (e) {
    return res.status(500).json({ error: true, message: e })
  }
})

//delete group
router.delete("/:groupId", async (req: express.Request, res: express.Response) => {
  try {
    const group = await GroupSchema.findById(req.params.groupId)
    if (!group) return res.status(404).json({ error: true, message: "No group was found with this id" })

    for (const groupUser of group.users) {
      const user = await UserSchema.findById(groupUser.userId)

      if (user) {
        user.groups = user.groups.filter((group) => group.groupId = groupUser.groupId)
        await user.save()
      }
    }

    await group.remove()
    return res.json({ error: false, message: "The group has been successfully deleted" })

  } catch (e) {
    return res.status(500).json({ error: true, message: e })
  }
})

//modify group
router.put("/:groupId", async (req: express.Request, res: express.Response) => {
  const inputGroupModify: InputGroupModify = plainToClass(InputGroupModify, req.body)

  try {
     await validateOrReject(inputGroupModify)
  } catch(err) {
    return res.status(400).json({ error: false, message: err })
  }

  try {
    const group = await GroupSchema.findById(req.params.groupId)
    if(!group) return res.status(404).json({ error: true, message: "No group was found with this id" })

    group.name = inputGroupModify.name || group.name
    group.description = inputGroupModify.description || group.description

    await group.save()
    
    return res.json({ error: false, message: "Group update succesfully" })
  } catch(e) {

  }
})



export default router