'use strict'

/*

uses:
  registration (for user registration and verification)
  centralAuth (the gateway to our APIs functions)
  groupfunctions (for general group functions)
  zoomLink (for zoom related functions)
  googlelinks (for Google Drive related functions)
  scanfile (for Image Processing)

*/

// Libraries
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
const scanfile = require('./scanfile.js')
const zoomlink = require('./zoomlink.js')
const googlelinks = require('./googlelinks.js')

app.use(cookieParser())
app.use(bodyParser())

// DEBUG FUNCTION
{
  app.use((req, res, next) => {
    console.log('-----------------------')
    console.log('Time: ', Date.now())
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    )
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization') //Add other headers used in your requests

    if ('OPTIONS' == req.method) {
      res.sendStatus(200)
    } else {
      console.log('API call to:', req.url)
      next()
    }
  })
  app.use((req, res, next) => {
    console.log('Request type: ', req.method)
    //console.log('request body')
    //console.log(req.body)
    //console.log('header')
    //console.log(req.headers)
    next()
  })
}

/*
  NOT GUARDED BY CENTRAL AUTH
*/

// registration and verification
app.use('/register', registration.authenticate)
app.use('/verify', registration.verify_email)

// use Google Cloud API to do ImageProcessing on the given file
app.use('/scandocument', scanfile.scanfile)

// Zoom related functions
app.use('/getzoom', zoomlink.getZoomLink)
app.use('/getzoomsignature', zoomlink.getZoomSignature)
app.use('/createzoom', zoomlink.createZoomLink)

// Google Drive related functions (document, spreadsheet, presentation)
app.use('/getgoogledoc', googlelinks.createDoc)
app.use('/getgooglesheet', googlelinks.createSheet)
app.use('/getgooglePres', googlelinks.createPres)

// get user details
app.use('/queryuser', groupfunctions.queryuser)

// Gateway - centralAuth
app.use('/apis', central_auth.central_auth)

/*
  GUARDED BY CENTRAL AUTH
*/

// delete the certain group
app.use('/apis/deletegroup', groupfunctions.deletegroup)

// update the certain group's description
app.use('/apis/updategroup', groupfunctions.updategroup)

// get group details
app.use('/apis/querygroup', groupfunctions.querygroup)

// create a new group
app.use('/apis/creategroup', groupfunctions.creategroup)

// get user's groups
app.use('/apis/queryusergroup', groupfunctions.queryusergroup)

// join the group
app.use('/apis/joingroup', groupfunctions.joingroup)

// leave the group
app.use('/apis/leavegroup', groupfunctions.leavegroup)

/*
  Haven't used this function
*/

app.use('/apis/kickuser', groupfunctions.kickuser)

// get group members of the certain group
app.use('/apis/getgroupmembers', groupfunctions.getgroupmembers)

// upload user icon
app.use('/apis/uploadusericon', groupfunctions.uploadusericon)

// upload groupicon
app.use('/apis/uploadgroupicon', groupfunctions.uploadgroupicon)

// update group details
app.use('/apis/updategroupprofile', groupfunctions.updategroupprofile)

/*
  ADMIN FUNCTIONS
*/

// list all groups
app.use('/apis/listgroup', groupfunctions.listgroup)

// list all users
app.use('/apis/getallusers', groupfunctions.getallusers)

// ban user
app.use('/apis/banuser', groupfunctions.banuser)

// update user password
app.use('/apis/updateuserpassword', groupfunctions.updateuserpassword)

// DEBUG page
app.use(express.static(path.join(__dirname, 'public')))

// server
app.listen(PORT, () => console.log(`serving on port ${PORT}`))
