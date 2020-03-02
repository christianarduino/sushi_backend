import axios from 'axios'
import { assert } from 'chai'
import dotenv from 'dotenv'
import UserSchema from '../../models/schema/userSchema'
//import sha256 from 'crypto-js/sha256';
dotenv.config()
const loginUrl: string = "http://localhost:3000/user/login"
const registerUrl: string = "http://localhost:3000/user/register"

const mockLoginUser = {
  username: "christianarduino",
  password: "prova1234"
}

const mockRegisterUser = {
  name: "Christian",
  surname: "Arduino",
  username: "christianarduino",
  email: "christianarduino3@gmail.com",
  password: "prova1234"
}

describe("/login", () => {
  it("should return 400 if username isn't a string", async () => {
    try {
      await axios.post(
        loginUrl,
        { ...mockLoginUser, username: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 400 if password isn't a string", async () => {
    try {
      await axios.post(
        loginUrl,
        { ...mockLoginUser, password: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 404 if user isn't found", async () => {
    try {
      await axios.post(
        loginUrl,
        mockLoginUser,
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 404)
    }
  })

  it("should return 200 if user is found", async () => {

    await axios.post(
      registerUrl,
      mockRegisterUser,
      { headers: { 'Content-Type': 'application/json' } }
    )

    try {
      await axios.post(
        loginUrl,
        mockLoginUser,
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      const user = await UserSchema.find(mockLoginUser)
      assert.equal(user.length, 1)
      assert.equal(error.response.status, 404)
    }
  })
})