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
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer");
const {
  Firestore
} = require('@google-cloud/firestore');
const os = require('os')
const firestore = new Firestore();
const user_table = firestore.collection('users')



module.exports = {
    central_auth: async function authenticate(req, res, next) {

  },


};
