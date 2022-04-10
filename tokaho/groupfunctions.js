'use strict'
/*
Descriptions:
 all functions related to group operations
  - POST /creategroup -> create group with user being an admin
  - POST /deletegroup -> delete group (id)
  - POST /updategroup -> update any field related to the group (user == admin)
  - POST /querygroup  -> query the group content (excluding the messages(messages can be accessed from the chat API))
  - POST /listgroup   -> list the group cotent of all group that the user can view

  -- working
  - POST /deletefromgroup -> delete the specified from the group **the field has to be a list e.g. zoomLink, admins, members, docLink


Exports:
  creategroup HTTP POST:
    required params:
      (header)"authorization": securityToken of the user
      (body)"groupname": the name of group being created
      *use x-www-form-urlencoded
    return:
      HTTP Status + JSON

  deletegroup HTTP POST:
    required params;
      (header)"authorization": security token of the users
      (body)"groupname": the name of group being deleted
      *use x-www-form-urlencoded
      * the user must be a global admin or a group admin to inital the delete operation
    return:
      HTTP Status + JSON

  updategroup HTTP POST:
    required params;
      (header)"authorization": security token of the users
      (body)"groupname": the name of group being deleted
      (body)"update": a JSON object represent the update field and value
          - e.g.  {"name":"unhappy","zoomLink":["zoomlink1","zoomlink2"]}
      *use x-www-form-urlencoded
      *the user must be a global admin or a group admin to inital the update operation
    return:
      HTTP Status + JSON

  querygroup HTTP POST:  (**DO NOT** contain messages, if you need the messages of the group, please visit the chat APIs)
    required params:
      (header)"authorization": security Token
      (body)"groupname": the name of group being queried
      *use x-www-form-urlencoded
      *the user must be a global admin or a group member to querythe profile of a private group
      return:
        HTTP Status + JSON

  listgroup HTTP POST:  (**DO NOT** contain messages, if you need the messages of the group, please visit the chat APIs)
    required params:
      (header)"authorization": security Token
      *the user must be a global admin or a group member in the private group to include it in the response
      return:
        HTTP Status + JSON

Implementations:
  creategroup:
  ("authorization" in the req.header will be checked and verify by centralAuth)
    1. check if groupname is present in the HTTP POST body
    3. check if groupname duplicated?
    4. create new group entry in the DB with the user as the only member
    5. add the group id to the user's group list
  groupActions:
    1. check if groupname exist?
    2. chedk is authorized ? (is admin?)
  deletegroup: (uses groupActions)
    0. pass the deletegroup function to groupsActions for checking(constraints)
      1. delete group from all user's grouplist
      2. delete group from collections
  updategroup: (uses groupActions)
    0. pass updategroup function to groupActions for checking(constraints)
      1. match fields (reject if it contains the "message" field)
      2. update fields
  querygroup: (uses groupActions)
    0. pass querygroup function go groupActions for checking(constraints)
      1. check additional constraints ( whether the group is private, if yes, whether the user is an admin or a member of the group)
      2. return the group content
  listgroup:
    0. check membership
    1. add the group's profile to the response if the use is authorized(a member/ admin of a private group) to read it
    2. return the groups data (without the chat messages)

HTTP response:
  creategroup:
    OK:
      status 200: success, return new group id
    Error:
      status 400: interal error, return error
      status 401: duplicated groupname, return "invalid/duplicated groupname"
      status 402: no groupname recieved, return "Missing groupname"
  deletegroup/updategroup/querygroup:
    OK:
      status 200: success, return OK
    Error:
      status 400: interal error, return error
      status 401: duplicated groupname, return "invalid/duplicated groupname"
             401: not a global admin nor group admin, return "unauthorized"
      status 402: no groupname recieved, return "Missing groupname"
  listgroup:
    OK:
      status 200: success, return all group contents
    Error:
      status 400: internal error, return error


Return JSON format:
{
  Error: xxxxxxxx,   (Optional field: exist if error happened)
  Succeed: yyyyyyy   (Optional field: exist if the API call runs smoothly)
}





*/

// Library
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const { Firestore, FieldValue } = require('@google-cloud/firestore')
const os = require('os')
const { deepStrictEqual } = require('assert')
const { resolveSoa } = require('dns')
const firestore = new Firestore()
const group_table = firestore.collection('groups')
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

async function groupsActions(req, res, next, custom_actions) {
  console.log('groupaction on:', req.body.groupname)
  //contain group name?
  if (!req.body || !req.body.groupname)
    return res.status(402).json({
      Error: 'Missing groupname',
    })
  //global admin?
  let isadmin = await isAdmin(req.header.verified.uid, req)
  try {
    let querySnapshot = await group_table
      .where('name', '==', req.body.groupname)
      .get()
    if (querySnapshot._size > 1) {
      return res.status(401).json({
        Error: 'multiple group found',
      })
    }
    if (querySnapshot._size < 1) {
      return res.status(401).json({
        Error: req.body.groupname + ' not found',
      })
    }

    for (var i in querySnapshot.docs) {
      // is group admin?
      let docu = querySnapshot.docs[i]
      let admin_list = docu.data().admins
      isadmin = isadmin || admin_list.includes(req.header.verified.uid)

      //custom functions
      await custom_actions(req, res, next, docu, isadmin)
    }
  } catch (e) {
    console.log('Error', e)
    return res.status(401).json({
      Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
    })
  }
}

module.exports = {
  creategroup: async function creategroup(req, res, next) {
    if (!req.body || !req.body.groupname)
      return res.status(402).json({
        Error: 'Missing groupname',
      })
    const q = await group_table.where('name', '==', req.body.groupname).get()
    if (q._size > 0) {
      return res.status(401).json({
        Error: 'invalid/duplicated groupname',
      })
    } else {
      let group_info = {
        name: req.body.groupname,
        description: 'Time to invite others to join',
        docsLink: null,
        sheetLink: null,
        presLink: null,
        group_icon:
          'https://thumbs.dreamstime.com/b/linear-group-icon-customer-service-outline-collection-thin-line-vector-isolated-white-background-138644548.jpg',
        isPrivate: false,
        members: [req.header.verified.uid],
        admins: [req.header.verified.uid],
      }
      //create group
      try {
        let resid = ''
        await group_table.add(group_info).then(
          //add group id to the user's groupList
          function (gpRef) {
            resid = gpRef.id
            user_table
              .doc(req.header.verified.uid)
              .get()
              .then((d) => {
                if (d.exists) {
                  let temp = d.data().groupList
                  temp.push(gpRef.id)
                  console.log('Document data:', d.data().groupList, temp)
                  user_table.doc(req.header.verified.uid).update({
                    groupList: temp,
                  })
                } else {
                  throw 'unknown error'
                }
              })
          },
        )
        //initialize empty message collections
        group_table.doc(resid).collection('messages').doc('dummy').set({})
        return res.status(200).json({
          Succeed: resid,
        })
      } catch (e) {
        console.log(e)
        return res.status(401).json({
          Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        })
      }
    }
  },

  deletegroup: async function deletegroup(req, res, next) {
    if (req.body.groupname) {
      groupsActions(req, res, next, (req, res, next, docu, isadmin) => {
        if (!isadmin) {
          throw new Assert('unauthorized')
        }
        //////////////////////////////////////////////

        docu.data().members.forEach((user) => {
          console.log(
            user,
            'initializing a delete action on group:',
            docu.data().name,
          )
          //delete group from every user's grouplist
          user_table
            .doc(user)
            .get()
            .then((d) => {
              if (d.exists) {
                //console.log('D - EXIST')
                let temp = d.data().groupList
                //console.log('temp: ' + temp)
                var delIdx = temp.indexOf(docu.id)
                //console.log('delIdx: ' + delIdx)
                if (delIdx !== -1) {
                  temp.splice(delIdx, 1)
                } else {
                  throw new Assert(
                    "multiple group found in user's grouplist:" + d.id,
                  )
                }
                //update user's grouplist
                user_table.doc(d.id).update({
                  groupList: temp,
                })
              } else {
                throw new Assert('unable to remove the group from user:' + d.id)
              }
            })
        })
        //remove the group from the groups collection
        firestore.recursiveDelete(docu.ref)
        console.log('deleted:', req.body.groupname)
        return res.status(200).json({
          Succeed: 'OK',
        })
      })
    } else {
      if (req.body.groupid) {
        console.log('delete by groupid')
        try {
          let isadmin = await isAdmin(req.header.verified.uid, req)
          console.log('isadmin', isadmin)
          let groupSnapshot = await group_table.doc(req.body.groupid).get()
          let docu = groupSnapshot
          console.log('group data', docu.data())
          if (docu.data().isPrivate) {
            if (
              !(
                isadmin || docu.data().members.includes(req.header.verified.uid)
              )
            ) {
              return res.status(401).json({
                Error: 'not authorized',
              })
            }
          }
          docu.data().members.forEach((user) => {
            console.log(
              user,
              'initializing a delete action on group:',
              docu.data().name,
            )
            //delete group from every user's grouplist
            user_table
              .doc(user)
              .get()
              .then((d) => {
                if (d.exists) {
                  let temp = d.data().groupList

                  var delIdx = temp.indexOf(docu.id)
                  if (delIdx !== -1) {
                    temp.splice(delIdx, 1)
                  } else {
                    throw new Assert(
                      "multiple group found in user's grouplist:" + d.id,
                    )
                  }
                  //update user's grouplist
                  user_table.doc(d.id).update({
                    groupList: temp,
                  })
                } else {
                  throw new Assert(
                    'unable to remove the group from user:' + d.id,
                  )
                }
              })
          })
          //remove the group from the groups collection
          firestore.recursiveDelete(docu.ref)
          console.log('deleted:', req.body.groupid)
          return res.status(200).json({
            Succeed: 'OK',
          })
        } catch (e) {
          console.log(e)
          return res.status(400).json({
            Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
          })
        }
      } else {
        return res.status(400).json({
          Error: 'please contain groupname or groupid',
        })
      }
    }
  },

  updategroup: async function updategroup(req, res, next) {
    groupsActions(req, res, next, async (req, res, next, docu, isadmin) => {
      if (!isadmin) {
        throw new Assert('unauthorized')
      }
      let resJson = {}
      if ('message' in req.body) {
        throw new Assert(
          'unable to update "message", please invoke the chat apis instead of updategroup',
        )
      }
      //update
      await docu.ref.update(JSON.parse(req.body.update))
      return res.status(200).json({
        Succeed: {
          updatedContent: await docu.ref.get().then((d) => {
            return d.data()
          }),
        },
      })
    })
  },

  querygroup: async function querygroup(req, res, next) {
    console.log('querygroup')
    console.log(req.body)
    if (req.body.groupname) {
      groupsActions(req, res, next, async (req, res, next, docu, isadmin) => {
        //check membership
        if (docu.data().isPrivate) {
          if (
            !isadmin ||
            !docu.data().member.includes(req.header.verified.uid)
          ) {
            throw new Assert('Not authorized, the requested group is private')
          }
        }
        return res.status(200).json({
          Succeed: {
            Content: docu.data(),
          },
        })
      })
    } else {
      if (req.body.groupid) {
        console.log('querygroup by groupid')
        try {
          let isadmin = await isAdmin(req.header.verified.uid, req)
          let groupSnapshot = await group_table.doc(req.body.groupid).get()
          let docu = groupSnapshot
          if (docu.data().isPrivate) {
            if (
              !isadmin ||
              !docu.data().members.includes(req.header.verified.uid)
            ) {
              return res.status(401).json({
                Error: 'not authorized',
              })
            }
            return res.status(200).json({
              Succeed: {
                Content: docu.data(),
              },
            })
          }
        } catch (e) {
          console.log(e)
          return res.status(400).json({
            Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
          })
        }
      } else {
        return res.status(400).json({
          Error: 'please contain groupname or groupid',
        })
      }
    }
  },

  listgroup: async function listgroup(req, res, next) {
    try {
      let allgroups = []
      console.log(req.header.verified)
      let isadmin = await isAdmin(req.header.verified.uid, req)
      let groupSnapshot = await group_table.get()
      // for each group
      for (let p in groupSnapshot.docs) {
        if (groupSnapshot.docs[p].data().isPrivate) {
          if (
            !(
              isadmin ||
              groupSnapshot.docs[p]
                .data()
                .members.includes(req.header.verified.uid)
            )
          ) {
            continue
          }
        }
        console.log('list:', groupSnapshot.docs[p].data().name)
        allgroups.push(groupSnapshot.docs[p].data())
      }
      return res.status(200).json({
        Succeed: {
          groups: allgroups,
        },
      })
    } catch (e) {
      console.log(e)
      return res.status(401).json({
        Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      })
    }
  },

  //TODO: move this to user function
  queryuser: async function queryuser(req, res, next) {
    console.log('queryuser')
    try {
      if (!req.body.userid) {
        throw new Assert('no userID provided')
      }
      let userRecord = await admin.auth().getUser(req.body.userid)
      let isVerified = userRecord.emailVerified
      let userSnapshot = await user_table.doc(req.body.userid).get()
      let docu = userSnapshot
      return res.status(200).json({
        Succeed: {
          isVerified: isVerified,
        },
        Content: docu.data(),
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      })
    }
  },

  //TODO: move this to user function
  banuser: async function banuser(req, res, next) {
    console.log('banuser')
    try {
      if (!req.body.userid) {
        throw new Assert('no userID provided')
      }
      let userRecord = await admin.auth().getUser(req.body.userid)
      let isVerified = userRecord.emailVerified
      let userSnapshot = await user_table.doc(req.body.userid).get()
      let docu = userSnapshot
      //ban user
      await docu.ref.update({ isBanned: true })

      return res.status(200).json({
        Succeed: {
          isVerified: isVerified,
        },
        Content: docu.data(),
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      })
    }
  },

  queryusergroup: async function queryusergroup(req, res, next) {
    console.log('queryusergroup')
    console.log(req.body)
    if (req.body.userid) {
      try {
        let allgroups = []
        let groupSnapshot = await group_table.get()
        for (let p in groupSnapshot.docs) {
          console.log(groupSnapshot.docs[p].data().members)
          if (!groupSnapshot.docs[p].data().members.includes(req.body.userid)) {
            continue
          }
          //console.log('list:', groupSnapshot.docs[p].id)
          let content = groupSnapshot.docs[p].data()
          content.groupid = groupSnapshot.docs[p].id
          allgroups.push(content)
        }
        console.log(allgroups)
        return res.status(200).json({
          Succeed: {
            Content: allgroups,
          },
        })
      } catch (e) {
        console.log(e)
        return res.status(400).json({
          Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        })
      }
    } else {
      return res.status(400).json({
        Error: 'please contain groupname or groupid',
      })
    }
  },

  joingroup: async function joingroup(req, res, next) {
    console.log('join group')
    console.log(req.body)
    const uid = req.header.verified.uid
    const groupid = req.body.groupid
    if (groupid) {
      try {
        // update in group collection
        let groupSnapshot = await group_table.doc(groupid).get()
        console.log('group data', groupSnapshot.data())
        await groupSnapshot.ref.update({ members: FieldValue.arrayUnion(uid) })

        // update in users collection
        let userSnapshot = await user_table.doc(uid).get()
        console.log('user data', userSnapshot.data())
        await userSnapshot.ref.update({
          groupList: FieldValue.arrayUnion(groupid),
        })

        return res.status(200).json({
          Succeed: true,
        })
      } catch (e) {
        console.log(e)
        return res.status(400).json({
          Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        })
      }
    } else {
      return res.status(400).json({
        Error: 'please contain groupid',
      })
    }
  },
}
