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
            return <GroupChatContainer/>
        case 'Google Docs':
            return <DocsContainer />
        case 'Google Sheets':
            return <SheetsContainer />
        case 'Google Drive':
            return <DriveContainer />
        default: <div/>
    }
};

export default ContentContainer;
