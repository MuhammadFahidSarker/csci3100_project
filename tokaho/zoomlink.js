// Library
const jwt = require('jsonwebtoken')
const nJwt = require('njwt');
const config = require('./SDK/config')
const rp = require('request-promise')
const crypto = require('crypto') // for zoom signature
//import { KJUR } from 'jsrsasign';
// import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

// const client = ZoomMtgEmbedded.createClient();

const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, config.APISecret)

const generateSignature = async(req, res, next) => {
  const apiKey = "CyxAFmRCQWeCyu4eGFC0IQ";
  const apiSecret = "V0vb2sbkmoaEP5DaWZFrq8Eq7FWB0ixsx1wc";
  const meetingNumber = req.body.meetingNumber;
  console.log(meetingNumber)
  const role = 0;
  // Prevent time sync issue between client signature generation and zoom 
  const timestamp = new Date().getTime() - 30000
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
  const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
  const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
  return res
    .status(200)
    .json({signature: signature})
}

const retrieveZoomLink = async (req, res, next) => {
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
      body:{
        "topic": "Test",
        "type": "2",
        "start_time": "2020-07-18T19:30:00",
        "duration": "1",
        "timezone": "America/Mexico_City",
        "password": "pass123",
        "agenda": "Test",
        "settings": {
          "waiting_room": false,
          "join_before_host": true,
          "email_notification": false,
          "registrants_email_notification":false
        }
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
      //   console.log('response is: ', response)

      // client.join({
      //   apiKey: 'l_oIehOeTp-VS7qJMt26EQ',
      //   signature: signature, // role in signature needs to be 1
      //   meetingNumber: meetingNumber,
      //   password: password,
      //   userName: userName
    //})
      console.log(response)
      res
        .status(200)
        .json({JoinURL: response.join_url})
    })
    .catch(function (err) {
      // API call failed...
      //console.log('API call failed, reason ', err)
      res.status(400).json({ Error: err })
    })
}

module.exports = {
  retrieveZoomLink: retrieveZoomLink,
  getZoomSignature: generateSignature,
}
