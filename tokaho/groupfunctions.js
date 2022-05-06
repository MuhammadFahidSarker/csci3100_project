'use strict'
/*
Description:
  - this section contains all group-related functions

Exports:
  - creategroup,
  - deletegroup,
  - updategroup,
  - querygroup,
  - listgroup,
  - queryuser,
  - banuser,
  - queryusergroup,
  - joingroup,
  - leavegroup,
  - kickuser,
  - getgroupmembers,
  - getallusers,
  - uploadusericon,
  - uploadgroupicon,
  - updategroupprofile,
  - updateuserpassword,

HTTP response:
  - OK:
      status 200: success
  - Error:
      status 401: error occured during function call
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

//check whether the given uid is an admin
async function isAdmin(user, req) {
  let d = await user_table.doc(req.header.verified.uid).get()
  //console.log(d)
  if (d.data().role == 'admin') return true
  else return false
}

/**
 * custom error class
 * for assertion
 */
class Assert extends Error {
  constructor(message) {
    super(message) // (1)
    this.name = 'Assertion'
    this.errormsg = message
  }
}

//run custom_actions on every groups indicated in the request
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

//create a new group in database
async function creategroup(req, res, next) {
  if (!req.body || !req.body.groupname || !req.body.description)
    return res.status(402).json({
      Error: 'Missing groupname',
    })
  // check if the gropu exist
  const q = await group_table.where('name', '==', req.body.groupname).get()
  if (q._size > 0) {
    return res.status(401).json({
      Error: 'invalid/duplicated groupname',
    })
  } else {
    //dummy group info
    let group_info = {
      name: req.body.groupname,
      description: req.body.description,
      docsLink: null,
      sheetLink: null,
      presLink: null,
      zoomLink: null,
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
}
//delete a group from the database by gropuID or groupName
async function deletegroup(req, res, next) {
  if (req.body.groupname) {
    //delete by gropu name
    groupsActions(req, res, next, (req, res, next, docu, isadmin) => {
      if (!isadmin) {
        //user is not an admin
        throw new Assert('unauthorized')
      }
      //start delection
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
    //delete by group id
    if (req.body.groupid) {
      console.log('delete by groupid')
      try {
        //check whether the user is an admin
        let isadmin = await isAdmin(req.header.verified.uid, req)
        console.log('isadmin', isadmin)
        //query the group
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
        //start delection
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
}

// update the group info by groupName
async function updategroup(req, res, next) {
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
}


// query the group's info by groupName or groupID
async function querygroup(req, res, next) {
  console.log('querygroup')
  console.log(req.body)
  if (req.body.groupname) {
    // query by group name
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
    //query by groupid
    if (req.body.groupid) {
      console.log('querygroup by groupid', req.body)
      try {
        // check whether the user is an admin
        let isadmin = await isAdmin(req.header.verified.uid, req)
        //query the database
        let groupSnapshot = await group_table.doc(req.body.groupid).get()
        let docu = groupSnapshot
        // check whether the user is authorized to read 
        if (docu.data().isPrivate) {
          if (
            !isadmin ||
            !docu.data().members.includes(req.header.verified.uid)
          ) {
            return res.status(401).json({
              Error: 'not authorized',
            })
          }
        }
        //return
        console.log('return', docu.data())
        return res.status(200).json({
          Succeed: {
            Content: docu.data(),
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
  }
}
//list all groups in the server
async function listgroup(req, res, next) {
  try {
    let allgroups = []
    console.log(req.header.verified)
    let isadmin = await isAdmin(req.header.verified.uid, req)
    //query all groups
    let groupSnapshot = await group_table.get()
    // for each group's profile
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
      //cache the group's profile
      allgroups.push(groupSnapshot.docs[p].data())
      allgroups[allgroups.length - 1].groupid = groupSnapshot.docs[p].id
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
}

// query a user profile by his uid
async function queryuser(req, res, next) {
  console.log('queryuser')
  try {
    if (!req.body.userid) {
      throw new Assert('no userID provided')
    }
    //get user record
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
}

//ban a user by its uid
async function banuser(req, res, next) {
  console.log('banuser')
  try {
    //check if it is requested by an Admin
    let isadmin = await isAdmin(req.header.verified.uid, req)
    if (!isadmin) {
      return res.status(401).json('unauthorized')
    }
    if (!req.body.userid) {
      throw new Assert('no userID provided')
    }

    //get user record
    let userRecord = await admin.auth().getUser(req.body.userid)
    let isVerified = userRecord.emailVerified
    let userSnapshot = await user_table.doc(req.body.userid).get()
    let docu = userSnapshot
    //ban user
    await docu.ref.update({ isBanned: true })

    return res.status(200).json({
      Succeed: true,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
    })
  }
}

// get all the groups that a user has joined
async function queryusergroup(req, res, next) {
  console.log('queryusergroup')
  console.log(req.body)
  if (req.body.userid) {
    try {
      //get all groups
      let allgroups = []
      let groupSnapshot = await group_table.get()
      //check if the user has joined it
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
}

//join a group by group id
async function joingroup(req, res, next) {
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
}

//leave a group by gropu id
async function leavegroup(req, res, next) {
  console.log('leave group')
  console.log(req.body)
  const uid = req.header.verified.uid
  const groupid = req.body.groupid
  if (groupid) {
    try {
      // update in group collection
      let groupSnapshot = await group_table.doc(groupid).get()
      console.log('group data', groupSnapshot.data())
      await groupSnapshot.ref.update({ members: FieldValue.arrayRemove(uid) })

      // update in users collection
      let userSnapshot = await user_table.doc(uid).get()
      console.log('user data', userSnapshot.data())
      await userSnapshot.ref.update({
        groupList: FieldValue.arrayRemove(groupid),
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
}

//kick a user by his uid
async function kickuser(req, res, next) {
  console.log('kick user')
  console.log(req.body)
  const uid = req.body.uid
  const groupid = req.body.groupid
  const callerid = req.header.verified.uid
  if (!groupid || !uid) {
    return res.status(401).json({
      Error: 'please contain groupid and uid',
    })
  }
  try {
    // update in group collection
    let groupSnapshot = await group_table.doc(groupid).get()
    console.log('group data', groupSnapshot.data())

    // check if the caller is a local admin
    if (!groupSnapshot.data().admins.includes(callerid)) {
      return res.status(401).json({
        Error: 'unauthorized',
      })
    }

    // san test
    if (uid == callerid) {
      return res.status(401).json({
        Error: 'you cannot kick yourself',
      })
    }

    await groupSnapshot.ref.update({ members: FieldValue.arrayRemove(uid) })

    // update in users collection
    let userSnapshot = await user_table.doc(uid).get()
    console.log('user data', userSnapshot.data())
    await userSnapshot.ref.update({
      groupList: FieldValue.arrayRemove(groupid),
    })

    return res.status(200).json({
      Succeed: true,
    })
  } catch (e) {
    console.log(e)
    return res.status(401).json({
      Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
    })
  }
}

//get all user belongs to a group
async function getgroupmembers(req, res, next) {
  console.log('getGroupMembers')
  console.log(req.body)
  const groupID = req.body.groupid
  if (groupID) {
    console.log('getGroupMembers by groupid', groupID)
    try {
      //query the group
      let groupSnapshot = await group_table.doc(req.body.groupid).get()
      let members = groupSnapshot.data().members
      let admins = groupSnapshot.data().admins
      let memberProfiles = []
      //cache all user
      for (let memberID of members) {
        let userSnapshot = await user_table.doc(memberID).get()
        let userData = userSnapshot.data()
        let profile = {
          name: userData.name,
          profileURL: userData.profile_icon,
          role: admins.includes(memberID) ? 'admin' : 'member',
        }
        memberProfiles.push(profile)
        memberProfiles[memberProfiles.length - 1].userid = memberID
      }
      return res.status(200).json({
        Succeed: true,
        Members: memberProfiles,
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
}

//list all users in the server
async function getallusers(req, res, next) {
  console.log('getAllUsers')
  console.log(req.body)
  try {
    //is admin?
    let allusers = []
    let isadmin = await isAdmin(req.header.verified.uid, req)
    if (!isadmin) {
      return res.status(401).json('unauthorized')
    }
    //query all users
    let userSnapshot = await user_table.get()
    for (let p in userSnapshot.docs) {
      console.log('list:', userSnapshot.docs[p].data().email)
      //console.log('ID:', userSnapshot.docs[p].id)
      allusers.push(userSnapshot.docs[p].data())
      allusers[allusers.length - 1].userid = userSnapshot.docs[p].id
    }
    return res.status(200).json({ Succeed: true, Users: allusers })
  } catch (err) {
    return res.status(401).json({ Error: err })
  }
}

//update user icon (by URL)
async function uploadusericon(req, res, next) {
  console.log('uploadusericon')
  console.log(req.body)
  try {
    if (!req.body.url) return res.status(401).json('No URL appended')
    //update
    await user_table.doc(req.header.verified.uid).update({
      profile_icon: req.body.url,
    })
    return res.status(200).json({ Succeed: true })
  } catch (err) {
    return res.status(401).json({ Error: err })
  }
}

//update group icon (by URL)
async function uploadgroupicon(req, res, next) {
  console.log('uploadusericon')
  console.log(req.body)
  try {
    if (!req.body.url) return res.status(401).json('No URL appended')
    //update
    await group_table.doc(req.body.groupid).update({
      group_icon: req.body.url,
    })
    return res.status(200).json({ Succeed: true })
  } catch (err) {
    return res.status(401).json({ Error: err })
  }
}

//update group's profile
async function updategroupprofile(req, res, next) {
  console.log('updategroupprofile!!!', req.body.groupid)
  console.log(req.body)
  try {
    if (!req.body.description || !req.body.name || !req.body.groupid)
      return res.status(401).json('no description/name/groupid')
    console.log('updating')
    //update
    await group_table.doc(req.body.groupid).update({
      description: req.body.description,
      name: req.body.name,
    })
    //await groupSnapshot.ref.update({ members: FieldValue.arrayRemove(uid) })
    return res.status(200).json({ Succeed: true })
  } catch (err) {
    return res.status(401).json({ Error: err })
  }
}

//update user password
async function updateuserpassword(req, res, next) {
  console.log('updateuserpassword', req.body.userid)
  console.log(req.body)
  try {
    if (!req.body.userid || !req.body.newpassword)
      return res.status(401).json('no userid/newpassword')
    let isadmin = await isAdmin(req.header.verified.uid, req)
    if (!isadmin) return res.status(401).json('unauthorized')
    //update password
    await admin.auth().updateUser(req.body.userid, {
      password: req.body.newpassword,
    })
    return res.status(200).json({
      Succeed: true,
    })
  } catch (err) {
    console.log(err)
    return res.status(401).json({ Error: err })
  }
}

module.exports = {
  creategroup,
  deletegroup,
  updategroup,
  querygroup,
  listgroup,
  queryuser,
  banuser,
  queryusergroup,
  joingroup,
  leavegroup,
  kickuser,
  getgroupmembers,
  getallusers,
  uploadusericon,
  uploadgroupicon,
  updategroupprofile,
  updateuserpassword,
}
