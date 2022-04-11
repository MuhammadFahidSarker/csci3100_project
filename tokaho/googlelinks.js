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
  if (!req.body || !req.body.groupID) {
    return res.status(401).json({
      Error: 'Missing Group ID',
    })
  }
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    //console.log(querySnapshot)
    if (!querySnapshot._fieldsProto) {
      return res.status(401).json({
        Error: 'The Group with ID: ' + req.body.groupID + ' was not found',
      })
    }
    //console.log(!querySnapshot.data().docsLink[0])
    if (!querySnapshot.data().docsLink) {
      driveService.files.create(
        {
          requestBody: {
            name: 'Union Test Doc File', //This can be name of your choice
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
          driveService.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'writer',
              type: 'anyone',
            },
          })
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
              return res.status(200).json({ Succeed: result.data.webViewLink })
            },
          )
        },
      )
    } else {
      // if there is no Google Doc File in the group
      console.log('Already have Doc File')
      return res.status(200).json({ Succeed: querySnapshot.data().docsLink })
    }
  } catch (err) {
    return res.status(401).json({
      Error: err,
    })
  }
}

async function createSheet(req, res, next) {
  if (!req.body || !req.body.groupID) {
    return res.status(401).json({
      Error: 'Missing Group ID',
    })
  }
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    //console.log(querySnapshot)
    if (!querySnapshot._fieldsProto) {
      return res.status(401).json({
        Error: 'The Group with ID: ' + req.body.groupID + ' was not found',
      })
    }
    //console.log(!querySnapshot.data().docsLink[0])
    if (!querySnapshot.data().sheetLink) {
      driveService.files.create(
        {
          requestBody: {
            name: 'Union Test Sheet File', //This can be name of your choice
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
          driveService.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'writer',
              type: 'anyone',
            },
          })
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

async function createPres(req, res, next) {
  if (!req.body || !req.body.groupID) {
    return res.status(401).json({
      Error: 'Missing Group ID',
    })
  }
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    //console.log(querySnapshot)
    if (!querySnapshot._fieldsProto) {
      return res.status(401).json({
        Error: 'The Group with ID: ' + req.body.groupID + ' was not found',
      })
    }
    //console.log(!querySnapshot.data().docsLink[0])
    if (!querySnapshot.data().presLink) {
      driveService.files.create(
        {
          requestBody: {
            name: 'Union Test Presentation File', //This can be name of your choice
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
          driveService.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'writer',
              type: 'anyone',
            },
          })
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
