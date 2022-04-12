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

export function ZoomContainer() {
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

  function getSignature(e) {
    e.preventDefault()
    let meetingNumber = getJoinAbleZoomMeetingLink() // <-------------change this
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

// export class DEBUG extends Component{
//     constructor(props) {
//         super(props);
//         this.state={
//             sheetLink:null,
//             loading: true,

//         }
//     }

//     componentDidMount() {
//         getGoogleSheetLink(this.props.group.groupid).then(res => {
//             console.log('sheet link recieved:',res.content)
//             if (res.success === true) {
//                 this.setState({
//                     sheetLink: res.content.sheetLink,
//                     loading: false,
//                 })
//             }else{
//                 console.log(res.error)
//             }
//         })
//     }

//     render() {
//         const {sheetLink, loading} = this.state;
//         const {toolbarHidden, group} = this.props;

//         return (
//             <div style={{marginLeft: toolbarHidden === true ? GOOGLE_TOOL_MARGIN_LEFT : null}}  id={'doc-container'} className="content-container">
//                 <TopNavigation group={group} toolbarHidden={toolbarHidden} url={sheetLink} type={'- Zoom'}/>

//                 {sheetLink === null ? <LoadingScreen/> : <div>
//                     {loading ? <LoadingScreen/> : null}
//                     <div id="meetingSDKElement">zoom here</div>
//                 </div>}
//             </div>
//         );
//     }
// }
