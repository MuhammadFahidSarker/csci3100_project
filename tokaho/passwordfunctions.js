'use strict'
/*
Description:
  - This is a middleware as the security module in this projectId
  - every incoming apis request go beyonds the /apis/ will be guarded by this
  centralAuth, only authorized user can move forward

Exports:
  centralAuth: HTTP POST --> every url after /apis/,
    required params: "authorization" as param in the http post body
                      , it should be the security_token obtain from firebase
                      after firebase-authentication in the client side
    changes:
      the user data will be put inside the req.header.verified
        - you can extract all  user metadata from req.header.verified

Implementations:
  centralAuth:
    1. verify the security_token with firebaseio
    2. pass the control to next handler or raise error


HTTP response:
  authenticate(registration):
    OK:
      pass the control to next handler
    Error:
      status 401: invalid token, return "not authorized"
      status 402: no token recieved, return "Missing values"
      status 403: outdated token, return "Token expired"
      status 404: unknown error or user not registered or user ac not verified, return error

*/

// Library
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const { Firestore } = require('@google-cloud/firestore')
const os = require('os')
const firestore = new Firestore()
const user_table = firestore.collection('users')

async function isAdmin(user, req) {
  let d = await user_table.doc(req.header.verified.uid).get()
  //console.log(d)
  if (d.data().role == 'admin') return true
  else return false
}

class Assert extends Error {
  constructor(message) {
    super(message) // (1)
    this.name = 'Assertion'
    this.errormsg = message
  }
}

module.exports = {
  changepassword: async function changepassword(req, res, next) {
    const uid = req.header.verified.uid
    const inputUid = req.body.uid
    const newPassword = req.body.newPassword
    let isadmin = await isAdmin(req.header.verified.uid, req)
    if (!isadmin && uid != inputUid) {
      throw new Assert(
        "Not authorized, the requested user id does not match invoker's user id",
      )
    }
    admin
      .auth()
      .updateUser(uid, {
        password: `${newPassword}`,
      })
      .then((userRecord) => {
        //console.log('Successfully updated user', userRecord.toJSON())
        return res.status(200).json({
          Succeed: {
            Content: 'New Password has been saved',
          },
        })
      })
      .catch((error) => {
        //console.log('Error updating user: ', error)
        return res.status(400).json({
          Error: `${error}`,
        })
      })
  },
}
