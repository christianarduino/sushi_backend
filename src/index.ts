import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRoutes from "./routes/user"
import groupRoutes from "./routes/group"

const app = express()
dotenv.config()

mongoose.connect(
  process.env.DB_CONNECT!,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    err ? console.log(err.message) : console.log("Connected to MongoDB")
  }
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", userRoutes)
app.use("/group", groupRoutes)

app.listen(3000, () => console.log("Server is listening on port 3000"))