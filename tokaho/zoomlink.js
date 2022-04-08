// Library
const jwt = require('jsonwebtoken')
const config = require('./SDK/config')
const rp = require('request-promise')
// import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

// const client = ZoomMtgEmbedded.createClient();

const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, config.APISecret)

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
          "registrants_email_notification":false.
        }
      ,
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
        .json({JoinURL: response.join_url })
    })
    .catch(function (err) {
      // API call failed...
      //console.log('API call failed, reason ', err)
      res.status(400).json({ Error: err })
    })
}

module.exports = {
  retrieveZoomLink: retrieveZoomLink,
}
