'use strict'
/*
Descriptions:
 all functions related to group operations
  - POST /creategroup -> create group with user being an admin
  - POST /deletegroup -> delete group (id)
  - POST /updategroup -> update any field related to the group (user == admin)

Exports:
  creategroup HTTP POST:
    required params:
      (header)"authorization": securityToken of the user
      (body)"groupname": the name of group being created
  deletegroup HTTP POST:
    required params;
      (header)"authorization": security token of the users
      (body)"groupname": the name of group being deleted
    * the user must be a global admin or a group admin to inital the delete operation

Implementations:
  creategroup:
  ("authorization" in the req.header will be checked and verify by centralAuth)
    1. check if groupname is present in the HTTP POST body
    3. check if groupname duplicated?
    4. create new group entry in the DB with the user as the only member
    5. add the group id to the user's group list
  deletegroup:
    1. check if groupname exists
    2. check if user is the admin of that group/ global admin
    3. delete group from all user's grouplist
    4. delete group from collections

HTTP response:
  creategroup:
    OK:
      status 200: success, return new group id
    Error:
      status 400: interal error, return error
      status 401: duplicated groupname, return "invalid/duplicated groupname"
      status 402: no groupname recieved, return "Missing groupname"
  deletegroup:
    OK:
      status 200: success, return OK
    Error:
      status 400: interal error, return error
      status 401: duplicated groupname, return "invalid/duplicated groupname"
      status 402: no groupname recieved, return "Missing groupname"
      status 402: not a global admin nor group admin, return "unauthorized"




*/

// Library
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer")
const {
  Firestore
} = require('@google-cloud/firestore')
const os = require('os')
const firestore = new Firestore()
const group_table = firestore.collection('groups')
const user_table = firestore.collection('users')


async function isAdmin(user, req) {
  let d = await user_table.doc(req.header.verified.uid).get()
  console.log(d)
  if (d.data().role == 'admin')
    return true
  else
    return false
}

module.exports = {
  creategroup: async function creategroup(req, res, next) {
    if (!req.body || !req.body.groupname)
      return res.status(402).send('Missing groupname')
    const q = await group_table.where('name', '==', req.body.groupname).get()
    if (q._size > 0) {
      return res.status(401).send('invalid/duplicated groupname')
    } else {
      let group_info = {
        name: req.body.groupname,
        description: 'Time to invite others to join',
        docsLink: [],
        zoomLink: [],
        group_icon: null,
        isBanned: false,
        isPrivate: false,
        members: [req.header.verified.uid],
        admins: [req.header.verified.uid]
      }
      //create group
      try {
        let resid = ''
        await group_table
          .add(group_info)
          .then(
            //add group id to user's groupList
            function(gpRef) {
              resid = gpRef.id
              user_table.doc(req.header.verified.uid).get().then((d) => {
                if (d.exists) {
                  let temp = d.data().groupList
                  temp.push(gpRef.id)
                  console.log("Document data:", d.data().groupList, temp)
                  user_table.doc(req.header.verified.uid).update({
                    groupList: temp
                  })
                } else {
                  throw ("unknown error")
                }
              })
            }
          )
        //initialize empty message collections
        group_table.doc(resid).collection("messages").doc('dummy').set({})
        return res.status(200).send(resid)
      } catch (e) {
        console.log(e)
        return res.status(401).send(e)
      }
    }
  },


  deletegroup: async function deletegroup(req, res, next) {
    //contain group name?
    if (!req.body || !req.body.groupname)
      return res.status(402).send('Missing groupname')
    //global admin?
    let isGlobalAdmin = await isAdmin(req.header.verified.uid, req)
    try {
      let querySnapshot = await group_table.where("name", "==", req.body.groupname).get()
      if (querySnapshot._size > 1) {
        return res.status(401).send('multiple group found')
      }
      if (querySnapshot._size < 1) {
        return res.status(401).send('group not found')
      }

      querySnapshot.forEach((docu) => {
        // is group admin?
        let admin_list = docu.data().admins
        let isadmin = isGlobalAdmin || admin_list.includes(req.header.verified.uid)
        if (!isadmin) {
          return res.status(403).send('unauthorized')
        }

        docu.data().members.forEach((user) => {
          console.log(user)

          //delete group from every users's grouplist
          user_table.doc(user).get().then((d) => {
            if (d.exists) {
              let temp = d.data().groupList

              var delIdx = temp.indexOf(docu.id)
              if (delIdx !== -1) {
                temp.splice(delIdx, 1)
              } else {
                throw ('multiple group found in user:', d.id)
              }
              //update user's grouplist
              user_table.doc(d.id).update({
                groupList: temp
              })
            } else {
              throw ('unable to remove group from user:', d.id)
            }
          })
        })
        //remove the group from the groups collection
        firestore.recursiveDelete(docu.ref)
      })

    } catch (e) {
      console.log("Error", e)
      return res.status(401).send(e)
    }
    console.log('deleted:', req.body.groupname)
    return res.status(200).send('OK')
  },

  updategroup: async function updategroup(req, res, next) {
    return
  },

}
