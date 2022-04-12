import TopNavigation from '../TopNavigation';
import { BsPlusCircleFill } from 'react-icons/bs';
import {GroupChatContainer, groupChatContainer} from "./groupChatContainer";
import {DocsContainer} from "./docsContainer";
import {DriveContainer} from "./driveContainer";
import {SheetsContainer} from "./sheetsContainer";
import {ZoomContainer} from "./zoomContainer";
// import { useState } from 'react';

const ContentContainer = (props) => {
    switch (props.type){
        case 'Group Chat':
            return <GroupChatContainer group={props.group} toolbarHidden={props.toolbarHidden} user={props.user}/>
        case 'Google Docs':
            return <DocsContainer group={props.group} toolbarHidden={props.toolbarHidden} user={props.user} />
        case 'Google Sheets':
            return <SheetsContainer group={props.group} toolbarHidden={props.toolbarHidden} user={props.user}/>
        case 'Google Presentation':
            return <DriveContainer group={props.group} toolbarHidden={props.toolbarHidden} user={props.user} />
        case 'Zoom':
            return <ZoomContainer group={props.group} toolbarHidden={props.toolbarHidden} user={props.user} />
        default: <div/>
    }
};

export default ContentContainer;
