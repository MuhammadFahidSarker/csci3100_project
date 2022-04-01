'use strict'

/*

uses:
  registration (for user registration and verification)


*/

// Library
const serviceAccount = require('./SDK/test-96f35-firebase-adminsdk-m8zbg-8e10e14cd1.json')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require("express")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
const {
  Firestore
} = require('@google-cloud/firestore');
const os = require('os')
// initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "test-96f35",
  databaseURL: "https://test-96f35-default-rtdb.firebaseio.com"
})
const app = express()
const PORT = 8080


/*
custom functions
*/
const registration = require('./registration.js');
const groupfunctions = require('./groupfunctions.js');

//
app.use(cookieParser());

//DEBUG
{
app.use((req, res, next) => {
  console.log('-----------------------')
  console.log('Time: ', Date.now());
  next();
});
app.use((req, res, next) => {
  console.log('Request type: ', req.method);
  console.log('request body')
  console.log(req.body)
  next();
});
}


//APIs
app.use('/register', registration.authenticate);
app.get('/verify', registration.verify_email);

app.use('/creategroup',groupfunctions.creategroup);

app.use(express.static(path.join(__dirname, 'public')))


// serve
app.listen(PORT, () => console.log(`serving on port ${PORT}`))
