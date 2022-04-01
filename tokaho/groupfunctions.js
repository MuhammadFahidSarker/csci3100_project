'use strict'
/*



POST /creategroup -> create group with user being an admin
POST /deletegroup -> delete group (id)
POST /updategroup -> update any field related to the group (user == admin)
	…

Exports:
  creategroup HTTP POST:
    required params:
      "authorization": securityToken of the user
      "groupname": the name of group being created


Implementations:
  creategroup:
    1. check if groupname, authorization(securityToken) are present in the HTTP POST body
    2. check if securityToken is valid?
    3. check if groupname duplicated?
    4. create new group entry in the DB

HTTP response:
  creategroup:
    OK:

    Error:

      status 402: no groupname recieved, return "Missing groupname"
      status 402: no security token recieved, return "Missing token"




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
  creategroup:async function creategroup(req, res, next) {
        if(!req.body.groupname)
          return res.return res.status(402).send('Missing groupname')
        if(!req.body.authorization)
          return res.return res.status(402).send('Missing security token')


        if (req.body.groupname && req.body.authorization){
          
        }else{

        }
  },
  deletegroup:async function deletegroup(req, res, next) {
      return
  },
  updategroup:async function updategroup(req, res, next) {
      return
  },

};
