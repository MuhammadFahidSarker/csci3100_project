import Iframe from "react-iframe";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getZoomSignature} from "../../../repository/repo";
import {getGoogleToolWidth, getGoogleToolHeight, GOOGLE_TOOL_MARGIN_LEFT} from "./etc";
import TopNavigation from "../TopNavigation";
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
const client = ZoomMtgEmbedded.createClient();
const meetingSDKElement = document.getElementById('meetingSDKElement');
//init zoomClient
try{
  client.init({
    debug: true,
    zoomAppRoot: meetingSDKElement,
    language: 'en-US',
    customize: {
      meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
      toolbar: {
        buttons: [
          {
            text: 'Custom Button',
            className: 'CustomButton',
            onClick: () => {
              console.log('custom button');
            }
          }
        ]
      }
    }
  });
}catch(e){
  console.log(e)
}

export function ZoomContainer() {
    // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
    var signatureEndpoint = 'http://localhost:8080/getzoomsignature'
    // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
    var sdkKey = 'CyxAFmRCQWeCyu4eGFC0IQ'
    var meetingNumber = 86135578913  // <-------------change this 
    // pass in the registrant's token if your meeting or webinar requires registration. More info here:
    // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
    // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
    var registrantToken = ''
  
    function getSignature(e) {
      e.preventDefault();
      getZoomSignature(meetingNumber)
      .then(response => {
          console.log('signature',response.signature,response.name)
        startMeeting(response.signature,response.name)
      }).catch(error => {
        console.error(error)
      })
    }
  
    function startMeeting(signature, user) {

      
  
      client.join({
          apiKey: 'CyxAFmRCQWeCyu4eGFC0IQ',
          signature: signature,
          meetingNumber: meetingNumber,
          password: "pass123",
          userName: user.displayName || user.email,
      //  userEmail: userEmail,
      //  tk: registrantToken
      })
    }
  
    return (
      <div className="App">
        <main>
          <h1>Zoom Meeting SDK Sample React</h1>
  
          {/* For Component View */}
          <div id="meetingSDKElement">
            {/* Zoom Meeting SDK Component View Rendered Here */}
          </div>
  
          <button onClick={getSignature}>Join Meeting</button>
        </main>
      </div>
    );
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