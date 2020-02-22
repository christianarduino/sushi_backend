import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRoutes from "./routes/user"
import groupRoutes from "./routes/group"
import groupUserRoutes from "./routes/groupUser"

const app = express()
dotenv.config()

mongoose.connect(
  process.env.DB_CONNECT!,
  { useNewUrlParser: true, useUnifiedTopology: true },
)

mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRoutes)
app.use("/group/user", groupUserRoutes)
app.use("/group", groupRoutes)

app.listen(3000, () => console.log("Server is listening on port 3000"))