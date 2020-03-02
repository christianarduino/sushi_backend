import express from 'express'
import { InputEvent } from '../models/input/event/inputEvent'
import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'

const router = express.Router()

router.post("/", async (req: express.Request, res: express.Response) => {
  const inputEvent: InputEvent = plainToClass(InputEvent, req.body)

try {
  await validateOrReject(inputEvent)
} catch(e) {
  return res.status(404).json({ error: false, message: "No valid input" })
}



})

export default router