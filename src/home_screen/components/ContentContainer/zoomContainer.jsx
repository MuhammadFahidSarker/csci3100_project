import Iframe from 'react-iframe'
import { Component } from 'react'
import { LoadingScreen } from '../../../common/loading'
import {
  getJoinAbleZoomMeetingLink,
  getZoomSignature,
} from '../../../repository/repo'
import {
  getGoogleToolWidth,
  getGoogleToolHeight,
  GOOGLE_TOOL_MARGIN_LEFT,
} from './etc'
import TopNavigation from '../TopNavigation'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'

export function ZoomContainer({ group, toolbarHidden, user }) {
  const client = ZoomMtgEmbedded.createClient()
  const meetingSDKElement = document.getElementById('meetingSDKElement')
  //init zoomClient
  try {
    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: [
          'topic',
          'host',
          'mn',
          'pwd',
          'telPwd',
          'invite',
          'participant',
          'dc',
          'enctype',
        ],
        toolbar: {
          buttons: [
            {
              text: 'Custom Button',
              className: 'CustomButton',
              onClick: () => {
                console.log('custom button')
              },
            },
          ],
        },
      },
    })
  } catch (e) {
    console.log(e)
  }

  async function getSignature(e) {
    e.preventDefault()
    let resp = await getJoinAbleZoomMeetingLink(user.userID, group.groupid) // <-------------change this 81149079754
    console.log('Resp: ' + resp)
    let meetingNumber = resp.response
    console.log('Meeting Number: ' + meetingNumber)
    getZoomSignature(meetingNumber)
      .then((response) => {
        console.log('signature', response.signature, response.name)
        startMeeting(response.signature, response.name, meetingNumber)
      })
      .catch((error) => {
        console.error(error)
      })
  }


  function startMeeting(signature, user, meetingNumber) {
    client.join({
      apiKey: 'CyxAFmRCQWeCyu4eGFC0IQ',
      signature: signature,
      meetingNumber: meetingNumber,
      password: 'pass123',
      userName: user.displayName || user.email,
    })
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting</h1>
        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  )
}
