// Library
const jwt = require('jsonwebtoken')
const nJwt = require('njwt')
const config = require('./SDK/config')
const rp = require('request-promise')
const crypto = require('crypto') // for zoom signature
//import { KJUR } from 'jsrsasign';
const { Firestore } = require('@google-cloud/firestore')

const firestore = new Firestore()
const group_table = firestore.collection('groups')

// import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

// const client = ZoomMtgEmbedded.createClient();

const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, config.APISecret)

const generateSignature = async (req, res, next) => {
  const apiKey = 'CyxAFmRCQWeCyu4eGFC0IQ'
  const apiSecret = 'V0vb2sbkmoaEP5DaWZFrq8Eq7FWB0ixsx1wc'
  const meetingNumber = req.body.meetingNumber
  console.log(meetingNumber)
  const role = 0
  // Prevent time sync issue between client signature generation and zoom
  const timestamp = new Date().getTime() - 30000
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
    'base64',
  )
  const hash = crypto
    .createHmac('sha256', apiSecret)
    .update(msg)
    .digest('base64')
  const signature = Buffer.from(
    `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`,
  ).toString('base64')
  return res.status(200).json({ signature: signature })
}

const createZoomLink = async (req, res, next) => {
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    if (querySnapshot.data().zoomLink) {
      return res.status(200).json({
        Message: 'The meeting has already been created:',
        JoinURL: querySnapshot.data().zoomLink,
      })
    }
    const options = {
      method: 'POST',
      uri: 'https://api.zoom.us/v2/users/me/meetings',
      // body: {
      //   topic: 'Test meeting',
      //   type: 1,
      //   settings: {
      //     host_video: true,
      //     participant_video: true,
      //     join_before_host: true,
      //     waiting_room: false,
      //     pre_schedule: true,
      //     start_time: '2022-04-07T12:02:00Z',
      //     jbh_time: 0,
      //   }
      body: {
        topic: 'Test',
        type: '2',
        start_time: '2020-07-18T19:30:00',
        duration: '1',
        timezone: 'America/Mexico_City',
        password: 'pass123',
        agenda: 'Test',
        settings: {
          waiting_room: false,
          join_before_host: true,
          email_notification: false,
          registrants_email_notification: false,
        },
      },
      auth: {
        bearer: token,
      },
      headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json',
      },
      json: true, //Parse the JSON string in the response
    }

    rp(options)
      .then(function (response) {
        console.log(response)
        group_table.doc(req.body.groupID).update({ zoomLink: response.id })
        res.status(200).json({ JoinURL: response.id })
      })
      .catch(function (err) {
        // API call failed...
        //console.log('API call failed, reason ', err)
        res.status(401).json({ Error: err })
      })
  } catch (err) {
    return res.status(401).json({ Error: err })
  }
}

const getZoomLink = async (req, res, next) => {
  try {
    let querySnapshot = await group_table.doc(req.body.groupID).get()
    if (!querySnapshot.data().zoomLink) {
      return res
        .status(401)
        .json({ Error: 'The meeting has not been created yet' })
    }
    return res.status(200).json({ JoinURL: querySnapshot.data().zoomLink })
  } catch (err) {
    return res.status(401).json({ Error: err })
  }
}

module.exports = {
  retrieveZoomLink: retrieveZoomLink,
  getZoomSignature: generateSignature,
  createZoomLink: createZoomLink,
  getZoomLink: getZoomLink,
}
