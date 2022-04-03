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

async function emailVerification(uid) {
  const client = await admin.auth().getUser(uid)
  return client.emailVerified
}

module.exports = {
  central_auth: async function authenticate(req, res, next) {
    const token = req.headers.authorization || req.cookies['authorization']
    try {
      const verified = await admin.auth().verifyIdToken(token)
      if (verified) {
        req.header.uid = verified.uid
        res.header('uid', verified.uid)
        try {
          let user_info = await user_table.doc(verified.uid).get()
          if (!user_info.exists) {
            return res.status(404).send('not registered')
          } else {
            //isVerified?
            console.log(await emailVerification(verified.uid))
            if (!(await emailVerification(verified.uid))) {
              console.log('user didnt verify his/her email yet')
              return res.status(404).send('account not verified')
            }
            req.header.verified = verified
            // pass the control to next handler
            console.log('Passed centralAuth')

            return next()
          }
        } catch (e) {
          console.log('ERROR:\n', e)
          throw e
        }
      } else {
        console.log('fail')
        return res.status(401).send('not authorized')
      }
    } catch (e) {
      if (token == null) {
        e = 'Token absent'
        return res.status(402).send(e)
      } else {
        if (e.errorInfo.code == 'auth/id-token-expired') {
          e = 'Token expired'
          return res.status(403).send(e)
        } else {
          return res.status(404).send(e)
        }
      }
    }
  },
}
