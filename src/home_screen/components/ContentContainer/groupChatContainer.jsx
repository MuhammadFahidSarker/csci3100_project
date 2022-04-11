import TopNavigation from "../TopNavigation";
import {BsPlusCircleFill} from "react-icons/bs";
import {Component, useEffect, useState} from "react";
import React from 'react';
import {LoadingScreen} from "../../../common/loading";
import {getGroupChats, sendMessage} from "../../../repository/repo";
import {BiSend} from "react-icons/all";
import ScrollToBottom from 'react-scroll-to-bottom';
import firebase from "firebase/compat";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {firebaseConfig} from "../../../repository/firebase_auth";

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()

export function GroupChatContainer ({group, toolbarHidden, user}){

    const groupId = group.id;
    const messagesRef = firestore.collection(`groups/${groupId}/messages`)
    const query = messagesRef.orderBy('createdAt').limit(25)
    // Hook for input value (send message)
    const [messages] = useCollectionData(query, { idField: 'id' })


    const sendMessage = async (text, url) => {
        console.log(user);
        // retrieves uid and photo from the current user
        const { userID, photoURL } = user
        // Post Message Data into Firestore
        await messagesRef.add({
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid:userID,
            photoURL,
            // attached file string (url from uploadFiles)
            attachedF: url,
        })

    }

    console.log(messages);

    return <div className={'content-container'}>
        <TopNavigation group={group} toolbarHidden={toolbarHidden}/>
        <div className={'content-list'} style={{}}>

        </div>

        <BottomBar onSend={(message) => sendMessage(message, null)}/>
    </div>
};

const BottomBar = ({onSend}) => {

    return <div className='bottom-bar'>
        {/*<PlusIcon />*/}
        <input type='text' id={'chatInput'} placeholder='Enter message...' className='bottom-bar-input'
               onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                       onSend(e.target.value);
                       e.target.value = '';
                   }
               }}/>
        <SendIcon onClick={(e) => {
            //get the value of input from chatInput and send it to onSend
            onSend(document.getElementById('chatInput').value);
            document.getElementById('chatInput').value = '';
        }}/>
    </div>
}

const Post = ({name, timestamp, text, photoURL = 'https://avatars.dicebear.com/api/open-peeps/1.svg'}) => {

    const seed = Math.round(Math.random() * 100);
    return (
        <div className={'post'}>
            <div className='avatar-wrapper'>
                <img src={photoURL} alt='' className='avatar'/>
            </div>

            <div className='post-content'>
                <p className='post-owner'>
                    {name}
                    <small className='timestamp'>{timestamp}</small>
                </p>
                <p className='post-text'>{text}</p>
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <BsPlusCircleFill
        size='22'
        className='text-green-500 dark:shadow-lg mx-2 dark:text-primary'
    />
);

const SendIcon = ({onClick}) => (
    <BiSend
        size='22'
        className='text-green-500 dark:shadow-lg mx-2 dark:text-primary'
        style={{cursor: 'pointer'}}
        onClick={onClick}
    />
);