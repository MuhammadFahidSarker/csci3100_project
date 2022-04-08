const { google } = require('googleapis')

// Service account
const credentials = `./SDK/test-96f35-firebase-adminsdk-m8zbg-8e10e14cd1.json`

// Add drive scope (gives full access)
const SCOPES = ['https://www.googleapis.com/auth/drive']

// Init the auth
const auth = new google.auth.GoogleAuth({
  keyFile: credentials,
  scopes: SCOPES,
})

async function createDoc(req, rest, next) {
  // init drive service (handels authorization)
  const driveService = google.drive({ version: 'v3', auth })

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
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      //const files = res.data.files
      // console.log(`${files.name} (${files.id})`)
      console.log(res.data.id)
      const fileId = res.data.id
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
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err)
          console.log(res.data)
        },
      )
    },
  )
}

async function createSheet(req, rest, next) {
  // init drive service (handels authorization)
  const driveService = google.drive({ version: 'v3', auth })

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
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      //const files = res.data.files
      // console.log(`${files.name} (${files.id})`)
      console.log(res.data.id)
      const fileId = res.data.id
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
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err)
          console.log(res.data)
        },
      )
    },
  )
}

async function createPres(req, rest, next) {
  // init drive service (handels authorization)
  const driveService = google.drive({ version: 'v3', auth })
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
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      //const files = res.data.files
      // console.log(`${files.name} (${files.id})`)
      console.log(res.data.id)
      const fileId = res.data.id
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
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err)
          console.log(res.data)
        },
      )
    },
  )
}

module.exports = {
  createDoc,
  createSheet,
  createPres,
}
