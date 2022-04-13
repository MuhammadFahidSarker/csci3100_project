import Iframe from 'react-iframe'
import {Component, useEffect, useState} from 'react'
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

import zoom from '../../../images/zoom.png'
import TopNavigation from '../TopNavigation'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'

export function ZoomContainer({ group, toolbarHidden, user }) {
  const client = ZoomMtgEmbedded.createClient()
  const meetingSDKElement = document.getElementById('meetingSDKElement')
  const [existingMeeting, setExistingMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(()=>{
    if(!group) return
    getJoinAbleZoomMeetingLink(group.id)
      .then(data=>{
        if(data.success){
          setExistingMeeting(data.response)
        }
        setLoading(false)
      })
  })

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

  async function joinMeeting(){
    setLoading(true)

    // start the meeting

    // if(success){
    //   setSuccess('Meeting started Successfully!')
    // }

    setLoading(false)

  }

  async function createMeeting(){
    setLoading(true)

    // create and start the meeting

    // if(success){
    //   setSuccess('Meeting started successfully!')
    // }

    setLoading(false)

  }

  if(loading === true){
    return <LoadingScreen withTopNav={false}/>
  }

  return (
    <div className={'content-container'}>
      <TopNavigation />
      <div className={'center'}>
        {success === '' ? <div>
          <img src={'http://assets.stickpng.com/images/5e8cde66664eae0004085457.png'} alt={'zoom'} width={'540px'} />
          <div className={'row'} style={{margin:'40px'}}>
            <button>Create New Meeting</button>
            {existingMeeting ? <button>Join Meeting</button> : null}
          </div>
        </div> : <div>{success}</div>}
      </div>
    </div>
  )
}
