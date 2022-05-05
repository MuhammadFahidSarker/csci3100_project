/*
Description:
  - this function serves as google drive files provider

Exports:
  - Google Doc Link
  - Google Sheet Link
  - Google Presentation Link

HTTP response:
  - OK:
      status 200: returns the link
  - Error:
      status 401: error occured during function call
*/

// Library
const { google } = require('googleapis')
const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore()
const group_table = firestore.collection('groups')

// Service account
const credentials = `./SDK/test-96f35-firebase-adminsdk-m8zbg-8e10e14cd1.json`

// Add drive scope (gives full access)
const SCOPES = ['https://www.googleapis.com/auth/drive']

// Init the auth
const auth = new google.auth.GoogleAuth({
  keyFile: credentials,
  scopes: SCOPES,
})

// init drive service (handels authorization)
const driveService = google.drive({ version: 'v3', auth })

// get GoogleDoc
async function createDoc(req, res, next) {
  // missing Group ID
  if (!req.body || !req.body.groupID) {
    return res.status(401).json({
      Error: 'Missing Group ID',
    })
  }
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    // check whether the group exists
    if (!querySnapshot._fieldsProto) {
      return res.status(401).json({
        Error: 'The Group with ID: ' + req.body.groupID + ' was not found',
      })
    }

    // check whether the document link exists in Firestore
    if (!querySnapshot.data().docsLink) {
      // create new doc file if doesn't exist
      driveService.files.create(
        {
          requestBody: {
            name: 'Union Doc File', //This can be name of your choice
            mimeType: 'application/vnd.google-apps.document',
          },
          media: {
            mimeType: 'application/vnd.google-apps.document',
          },
        },
        (err, result) => {
          if (err) {
            console.log('The API returned an error: ' + err)
            return res.status(401).json({
              Error: err,
            })
          }
          console.log(result.data.id)
          const fileId = result.data.id

          // set up everyone as a writer of the document
          driveService.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'writer',
              type: 'anyone',
            },
          })

          // get the doc link
          driveService.files.get(
            {
              fileId: fileId,
              fields: 'webViewLink, webContentLink',
            },
            (err, result) => {
              if (err) {
                console.log('The API returned an error: ' + err)
                return res.status(401).json({
                  Error: err,
                })
              }
              console.log(result.data)

              // store the link into database
              group_table
                .doc(req.body.groupID)
                .update({ docsLink: result.data.webViewLink })

              // return the link
              return res.status(200).json({ Succeed: result.data.webViewLink })
            },
          )
        },
      )
    } else {
      // if there is a Google Doc File in the group
      console.log('Already have Doc File')
      return res.status(200).json({ Succeed: querySnapshot.data().docsLink })
    }
  } catch (err) {
    return res.status(401).json({
      Error: err,
    })
  }
}

// get GoogleSheet
async function createSheet(req, res, next) {
  // missing Group ID
  if (!req.body || !req.body.groupID) {
    return res.status(401).json({
      Error: 'Missing Group ID',
    })
  }
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    // check whether the group exists
    if (!querySnapshot._fieldsProto) {
      return res.status(401).json({
        Error: 'The Group with ID: ' + req.body.groupID + ' was not found',
      })
    }

    // check whether the sheet link exists in Firestore
    if (!querySnapshot.data().sheetLink) {
      // create new sheet file if doesn't exist
      driveService.files.create(
        {
          requestBody: {
            name: 'Union Sheet File', //This can be name of your choice
            mimeType: 'application/vnd.google-apps.spreadsheet',
          },
          media: {
            mimeType: 'application/vnd.google-apps.spreadsheet',
          },
        },
        (err, result) => {
          if (err) {
            console.log('The API returned an error: ' + err)
            return res.status(401).json({
              Error: err,
            })
          }
          console.log(result.data.id)
          const fileId = result.data.id

          // set up everyone as a writer of the document
          driveService.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'writer',
              type: 'anyone',
            },
          })

          // get the sheet link
          driveService.files.get(
            {
              fileId: fileId,
              fields: 'webViewLink, webContentLink',
            },
            (err, result) => {
              if (err) {
                console.log('The API returned an error: ' + err)
                return res.status(401).json({
                  Error: err,
                })
              }

              console.log(result.data)
              // store the link into database
              group_table
                .doc(req.body.groupID)
                .update({ sheetLink: result.data.webViewLink })

              // return the link
              return res.status(200).json({ Succeed: result.data.webViewLink })
            },
          )
        },
      )
    } else {
      // if there is no Google Sheet File in the group
      console.log('Already have Sheet File')
      return res.status(200).json({ Succeed: querySnapshot.data().sheetLink })
    }
  } catch (err) {
    return res.status(401).json({
      Error: err,
    })
  }
}

// get GooglePres
async function createPres(req, res, next) {
  // missing Group ID
  if (!req.body || !req.body.groupID) {
    return res.status(401).json({
      Error: 'Missing Group ID',
    })
  }
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    // check whether the group exists
    if (!querySnapshot._fieldsProto) {
      return res.status(401).json({
        Error: 'The Group with ID: ' + req.body.groupID + ' was not found',
      })
    }

    // check whether the presentation link exists in Firestore
    if (!querySnapshot.data().presLink) {
      // create new presentation file if doesn't exist
      driveService.files.create(
        {
          requestBody: {
            name: 'Union Presentation File', //This can be name of your choice
            mimeType: 'application/vnd.google-apps.presentation',
          },
          media: {
            mimeType: 'application/vnd.google-apps.presentation',
          },
        },
        (err, result) => {
          if (err) {
            console.log('The API returned an error: ' + err)
            return res.status(401).json({
              Error: err,
            })
          }
          console.log(result.data.id)
          const fileId = result.data.id
          // set up everyone as a writer of the document
          driveService.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'writer',
              type: 'anyone',
            },
          })
          // get the pres link
          driveService.files.get(
            {
              fileId: fileId,
              fields: 'webViewLink, webContentLink',
            },
            (err, result) => {
              if (err) {
                console.log('The API returned an error: ' + err)
                return res.status(401).json({
                  Error: err,
                })
              }

              console.log(result.data)
              // store the link into database
              group_table
                .doc(req.body.groupID)
                .update({ presLink: result.data.webViewLink })
              return res.status(200).json({ Succeed: result.data })
            },
          )
        },
      )
    } else {
      // if there is no Google Presentation File in the group
      console.log('Already have Presentation File')
      // return the link
      return res.status(200).json({ Succeed: querySnapshot.data().presLink })
    }
  } catch (err) {
    return res.status(401).json({
      Error: err,
    })
  }
}

module.exports = {
  createDoc,
  createSheet,
  createPres,
}
