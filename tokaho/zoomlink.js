// Library
const jwt = require('jsonwebtoken')
const config = require('./SDK/config')
const rp = require('request-promise')

const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload, config.APISecret)

const retrieveZoomLink = async (req, res, next) => {
  const options = {
    method: 'POST',
    uri: 'https://api.zoom.us/v2/users/me/meetings',
    body: {
      topic: 'Test meeting',
      type: 1,
      settings: {
        host_video: 'true',
        participant_video: 'true',
        join_before_host: 'true',
        waiting_room: 'true',
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
      //   console.log('response is: ', response)
      res
        .status(200)
        .json({ StartURL: response.start_url, JoinURL: response.join_url })
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
