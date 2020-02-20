import express from "express"
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { RegisterUser, LoginUser } from '../models/interface/userInterface'
import UserSchema, { UserDoc } from '../models/entity/userEntity'
import sha256 from 'crypto-js/sha256';

const router: express.Router = express.Router()

//user login
router.post("/login", async (req: express.Request, res: express.Response) => {
  const loginUser: LoginUser = plainToClass(LoginUser, req.body)

  try {
    await validateOrReject(loginUser)
  } catch (e) {
    return res.status(400).json({ error: true, message: e })
  }

  const user: (UserDoc)[] = await UserSchema.find({ username: loginUser.username, password: sha256(loginUser.password).toString() })

  if (user.length > 0) {
    return res.json({ error: false, user: user[0] })
  } else {
    return res.status(404).json({ error: true, message: "No user with these credentials was found" })
  }

})

//user register
router.post("/register", async (req: express.Request, res: express.Response) => {
  const registerUser: RegisterUser = plainToClass(RegisterUser, req.body)

  //validation
  try {
    await validateOrReject(registerUser)
  } catch (e) {
    return res.status(400).json({ error: true, message: e })
  }

  try {

    //hashing password
    registerUser.password = sha256(registerUser.password).toString()

    //check if email exists
    let user: (UserDoc)[] = await UserSchema.find({ email: registerUser.email })
    if (user.length > 0) {
      return res.status(400).json({ error: true, message: "Someone with this email already exists" })
    }

    //check if username exists
    user = await UserSchema.find({ username: registerUser.username })
    if (user.length > 0) {
      return res.status(400).json({ error: true, message: "Someone with this username already exists" })
    }

    //create new user
    const newUser: UserDoc = new UserSchema({
      name: registerUser.name,
      surname: registerUser.surname,
      email: registerUser.email,
      username: registerUser.username,
      password: registerUser.password
    })

    //save new user on db
    const savedUser = await newUser.save()

    return res.json({
      error: false,
      savedUser
    })
  } catch (error) {
    return res.status(500).json({ error: true, message: error })
  }
})

//user delete
router.delete("/delete/:id", async (req: express.Request, res: express.Response) => {
  const user = await UserSchema.findOneAndDelete(req.params.id)
  if (user) {
    return res.json({ error: false, message: "The user has been successfully deleted" })
  } else {
    return res.status(404).json({ error: true, message: "No user was found with this id" })
  }
})

//user update
router.put("/update/:id", async (req: express.Request, res: express.Response) => {
  
})

export default router