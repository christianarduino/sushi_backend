import axios from 'axios'
import { assert } from 'chai'
import * as mongoose from 'mongoose';
import {Mockgoose} from 'mockgoose';
//import sha256 from 'crypto-js/sha256';

const url: string = "http://localhost:3000/user/login"
const dbConnection: string = process.env.DB_CONNECT!
let mockgoose: Mockgoose = new Mockgoose(mongoose);

const mockLoginUser = {
  username: "christianarduino",
  password: "prova1234"
}

describe("/login", () => {

  it("should return 400 if username isn't a string", async () => {
    try {
      await axios.post(
        url,
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
        url,
        { ...mockLoginUser, password: 1 },
        { headers: { 'Content-Type': 'application/json' } }
      )
      assert.fail("This request didn't fail")
    } catch (error) {
      assert.equal(error.response.status, 400)
    }
  })
})