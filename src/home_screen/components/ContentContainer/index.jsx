import TopNavigation from '../TopNavigation';
import { BsPlusCircleFill } from 'react-icons/bs';
import {GroupChatContainer, groupChatContainer} from "./groupChatContainer";
import {DocsContainer} from "./docsContainer";
import {DriveContainer} from "./driveContainer";
import {SheetsContainer} from "./sheetsContainer";
// import { useState } from 'react';

const ContentContainer = (props) => {
    switch (props.type){
        case 'Group Chat':
            return <GroupChatContainer toolbarHidden={props.toolbarHidden} user={props.user}/>
        case 'Google Docs':
            return <DocsContainer  toolbarHidden={props.toolbarHidden} user={props.user} />
        case 'Google Sheets':
            return <SheetsContainer  toolbarHidden={props.toolbarHidden} user={props.user}/>
        case 'Google Drive':
            return <DriveContainer toolbarHidden={props.toolbarHidden} user={props.user} />
        default: <div/>
    }
};

export default ContentContainer;
