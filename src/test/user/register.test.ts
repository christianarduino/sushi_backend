import axios from 'axios'
import { assert } from 'chai'

const url: string = "http://localhost:3000/user/register"

const mockRegisterUser = {
  "name": "Christian",
  "surname": "Arduino",
  "email": "christianarduino3@gmail.com",
  "username": "christianarduino",
  "password": "prova1234"
}

describe("/register", () => {
  it("should return 400 if name isn't a string", async () => {
    try {
      await axios.post(
        url,
        { ...mockRegisterUser, name: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 400 if surname isn't a string", async () => {
    try {
      await axios.post(
        url,
        { ...mockRegisterUser, surname: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 400 if email isn't an email", async () => {
    try {
      await axios.post(
        url,
        { ...mockRegisterUser, email: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 400 if username isn't a string", async () => {
    try {
      await axios.post(
        url,
        { ...mockRegisterUser, username: 1 },
        { headers: { 'Content-Type': 'application/json' } })
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 400 if password isn't a string", async () => {
    try {
      await axios.post(
        url,
        { ...mockRegisterUser, username: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })

  it("should return 400 if password is short than 4 characters", async () => {
    try {
      await axios.post(
        url,
        { ...mockRegisterUser, password: "a1s" },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })
})