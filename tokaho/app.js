'use strict'

/*

uses:
  registration (for user registration and verification)
  centralAuth (the gateway to our APIs functions)
  groupfunctions(create group, delete group, update group's info)

*/

// Library
const serviceAccount = require('./SDK/test-96f35-firebase-adminsdk-m8zbg-8e10e14cd1.json')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const xoauth2 = require('xoauth2')
const { Firestore } = require('@google-cloud/firestore')
const os = require('os')
// initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'test-96f35',
  databaseURL: 'https://test-96f35-default-rtdb.firebaseio.com',
})
const app = express()
const PORT = 8080

/*
custom functions
*/
const central_auth = require('./centralAuth.js')
const registration = require('./registration.js')
const groupfunctions = require('./groupfunctions.js')
const userfunctions = require('./userfunctions.js')
//
app.use(cookieParser())
app.use(bodyParser())

//DEBUG
{
  app.use((req, res, next) => {
    console.log('-----------------------')
    console.log('Time: ', Date.now())
    next()
  })
  app.use((req, res, next) => {
    console.log('Request type: ', req.method)
    console.log('request body')
    console.log(req.body)
    next()
  })
}

// not guarded by centralAuth
app.use('/register', registration.authenticate)
app.get('/verify', registration.verify_email)

//Gateway - centralAuth
app.use('/apis', central_auth.central_auth)
//guarded by centralAuth
app.use('/apis/creategroup', groupfunctions.creategroup)
app.use('/apis/deletegroup', groupfunctions.deletegroup)
app.use('/apis/updategroup', groupfunctions.updategroup)
app.use('/apis/querygroup', groupfunctions.querygroup)
app.use('/apis/listgroup', groupfunctions.listgroup)
app.use('/apis/changepassword', userfunctions.changepassword)
app.use('/apis/listuser', userfunctions.listuser)

//DEBUG page
app.use(express.static(path.join(__dirname, 'public')))

// serve
app.listen(PORT, () => console.log(`serving on port ${PORT}`))
