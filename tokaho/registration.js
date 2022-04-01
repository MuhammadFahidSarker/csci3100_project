'use strict'
/*
Description:
  This file contains two functions responsible for the user registration
    - authenticate: sending out verification email
    - verify_email: verify the email address by the link
                    inside the verification email

Exports:
  authenticate: HTTP POST,
    required params: "authorization" as param in the http post body
                      , it should be the security_token obtain from firebase
                      after firebase-authentication in the client side

  verify_email: HTTP GET,
    required params: "id" as param in http GET query
                      e.g.: localhost:8000/verify?id=abcdefg

Implementations:
  authenticate:
    1. verify the security_token with firebaseio
    2. check if the user is registered or not
      YES:
        return already registered
      NO:
        -create new document under the user collection with
          userID as the  document name
        - send verification email to the user's email address

  verify_email:
    1. check if "id" present in http.query
    2. check if the user represented by "id" present in the DB
    3. turn verified to True or raise error


HTTP response:
  authenticate(registration):
    OK:
      status 300: created user entries, return user_info
      status 301: already registered, return "already registered"
    Error:
      status 401: invalid token, return "not authorized"
      status 402: no token recieved, return "Missing values"
      status 403: outdated token, return "Token expired"
      status 404: fail to send email, return "internal error"

  verify_email:
    OK:
      status 200: verified
    Error:
      status 402: userID absent in header, return "Missing userID"
      status 403: userID not found in DB, return "invalid userID"
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

//default dummy account
const smtpTransport = nodemailer.createTransport(
  "smtps://baidu1pan@gmail.com:" + encodeURIComponent('a987456321') +
  "@smtp.gmail.com:465"
);


module.exports = {
  authenticate: async function authenticate(req, res, next) {
    const token = req.headers.authorization || req.cookies['authorization']
    try {
      const verified = await admin.auth().verifyIdToken(token)
      if (verified) {
        req.header.uid = verified.uid
        res.header('uid', verified.uid)
        try {
          let user_info = await user_table.doc(verified.uid).get()
          if (!user_info.exists) {
            verified.role = 'member'
            verified.preferences = []

            if (await create_user(verified))
              return res.status(300).send(user_info)
            else {
              return res.status(404).send('internal error')
            }
          } else {
            await send_email(verified.email, verified.uid)
            return res.status(301).send('already registered, new email send again')
          }
        } catch (e) {
          console.log('ERROR:\n', e)
          throw (e)
        }
      } else {
        console.log('fail')
        return res.status(401).send('not authorized');
      }
    } catch (e) {
      console.log(e)
      if (token == null) {
        e = 'Token absent'
        return res.status(402).send(e);
      } else {
        if (e.errorInfo.code == 'auth/id-token-expired') {
          e = 'Token expired'
          return res.status(403).send(e);
        }else{
          return res.status(404).send(e);
        }
      }
    }
  },


  verify_email: async function verify_email(req, res, next) {
    if (req.query.id) {
      let user = await user_table.doc(req.query.id).get()
      if (user.exists) {
        user_table.doc(req.query.id).update({
          verified: true
        })
        return res.status(200).send("verified")

      } else {
        return res.status(403).send("invalid userID")
      }

    } else {
      return res.status(402).send("Missing userID")
    }
  }

};



async function create_user(user) {
  let user_info = {
    email: user.email,
    name: user.name || user.email,
    preferences: user.preferences,
    profile_icon: user.picture || null,
    role: user.role,
    verified: false,
    groupList: []
  }
  try{
    user_table.doc(user.uid).set(user_info)
  }catch(e){
    console.log(e)
  }
  return send_email(user.email, user.uid)
}

async function send_email(email, identifier) {
  let link = "http://" + os.hostname() + "/verify?id=" + identifier;
  let mailOptions = {
    to: email,
    subject: "Please confirm your Email account",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a><br><br><br><br>best,<br>UNION"
  }

  try{
    await smtpTransport.sendMail(mailOptions)
    console.log('email sent')
    return true
  }catch(e){
    console.log(e)
    return false
  }
}
