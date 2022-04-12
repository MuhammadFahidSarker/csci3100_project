import { useState } from 'react';
import { BsHash } from 'react-icons/bs';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';
import {getJoinAbleZoomMeetingLink} from "../../../repository/repo";
import {BiLinkExternal, GoLinkExternal} from "react-icons/all";

const chats = ['Group Chat']
const googleTools = ['Google Docs', 'Google Sheets', 'Google Presentation']
const zoomTools = ['Join Meeting', 'Zoom']

const ChannelBar = ({changeType}) => {
  return (
    <div id={'channelBar'} className='channel-bar shadow-lg' style={{height:'100vh'}}>
      <ChannelBlock />
      <div className='channel-container'>
        <Dropdown header = 'Chat' setType = {changeType} selections={chats}/>
        <Dropdown header = 'Google Docs' setType = {changeType} selections={googleTools} />
        <Dropdown header = 'Zoom' selections = {zoomTools} setType={changeType}/>
      </div>
    </div>
  );
};

const Dropdown = ({ header, selections, setType }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className='dropdown'>
      <div onClick={() => setExpanded(!expanded)} className='dropdown-header'>
        <ChevronIcon expanded={expanded} />
        <h5
          className={expanded ? 'dropdown-header-text-selected' : 'dropdown-header-text'}
        >
          {header}
        </h5>
        <FaPlus size='12' className='text-accent text-opacity-80 my-auto ml-auto' />
      </div>
      {expanded &&
        selections &&
        selections.map((selection) => <TopicSelection selection={selection} changeType={setType} />)}
    </div>
  );
};

const ChevronIcon = ({ expanded }) => {
  const chevClass = 'text-accent text-opacity-80 my-auto mr-1';
  return expanded ? (
    <FaChevronDown size='14' className={chevClass} />
  ) : (
    <FaChevronRight size='14' className={chevClass} />
  );
};

const TopicSelection = ({ selection, changeType}) => (
  <div className='dropdown-selection'>
    <BsHash size='24' className='text-gray-400' />
    <h5 className='dropdown-selection-text' onClick = {(e) => {
        if(selection === 'Join Meeting'){
            getJoinAbleZoomMeetingLink().then(link => {
                window.open(link, '_blank');
            })
        }else if (selection === 'Zoom'){
            changeType(selection)
            // Create meeting
        }else {
            changeType(selection)
        }
    }}>{selection} </h5>

  </div>
);

const ChannelBlock = () => (
  <div className='channel-block'>
    <h5 className='channel-block-text'>Tools</h5>
  </div>
);

export default ChannelBar;
