import { useState } from 'react';
import { BsHash } from 'react-icons/bs';
import {FaChevronDown, FaChevronRight, FaMinus, FaPlus} from 'react-icons/fa';
import {getJoinAbleZoomMeetingLink} from "../../../repository/repo";

/**
 * Categories of the channel bar (e.g. Chats, Groups, etc.)
 * @type {string[]}
 */
const chats = ['Group Chat']
const googleTools = ['Google Docs', 'Google Sheets', 'Google Presentation']
const zoomTools = ['Meeting']

/**
 * The channel bar component shows the categories of the channel bar and elements of each category.
 * @param changeType
 * @returns {JSX.Element}
 * @constructor
 */
const ChannelBar = ({changeType}) => {
  return (
    <div id={'channelBar'} className='channel-bar shadow-lg' style={{height:'100vh'}}>
      <ChannelBlock />
      <div className='channel-container'>
        <Dropdown header = 'Chat' setType = {changeType} selections={chats}/>
        <Dropdown header = 'Google Tools' setType = {changeType} selections={googleTools} />
        <Dropdown header = 'Zoom' selections = {zoomTools} setType={changeType}/>
      </div>
    </div>
  );
};

/**
 * @description displays the menus of a category
 * @param header
 * @param selections
 * @param setType
 * @returns {JSX.Element}
 * @constructor
 */
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
          {expanded ? <FaMinus size='12' className='text-accent text-opacity-80 my-auto ml-auto' />: <FaPlus size='12' className='text-accent text-opacity-80 my-auto ml-auto' /> }
      </div>
      {expanded &&
        selections &&
        selections.map((selection) => <TopicSelection selection={selection} changeType={setType} />)}
    </div>
  );
};

/**
 * @description displays the icons of an action
 * @param expanded
 * @returns {JSX.Element}
 * @constructor
 */
const ChevronIcon = ({ expanded }) => {
  const chevClass = 'text-accent text-opacity-80 my-auto mr-1';
  return expanded ? (
    <FaChevronDown size='14' className={chevClass} />
  ) : (
    <FaChevronRight size='14' className={chevClass} />
  );
};

/**
 * @description displays the name of a category
 * @param selection
 * @param changeType
 * @returns {JSX.Element}
 * @constructor
 */
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
