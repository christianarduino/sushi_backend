import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRoutes from "./routes/user"
import groupRoutes from "./routes/group"
import groupUserRoutes from "./routes/groupUser"
import groupPendingRoutes from "./routes/groupPending"

const app = express()
dotenv.config()
let isTest: boolean = process.env.ENVIRON == "test"

mongoose.connect(
  isTest ? process.env.TEST_DB! : process.env.DB_CONNECT!,
  { useNewUrlParser: true, useUnifiedTopology: true },
)

mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRoutes)
app.use("/group/pending", groupPendingRoutes)
app.use("/group/user", groupUserRoutes)
app.use("/group", groupRoutes)
//app.use("/event")

app.listen(3000, () => console.log("Server is listening on port 3000"))