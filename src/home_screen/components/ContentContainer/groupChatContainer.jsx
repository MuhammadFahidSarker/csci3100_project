import TopNavigation from '../TopNavigation'
import { BsPlusCircleFill } from 'react-icons/bs'
import { Component, useEffect, useRef, useState } from 'react'
import React from 'react'
import { LoadingScreen } from '../../../common/loading'
import { getGroupChats, sendMessage } from '../../../repository/repo'
import { BiSend } from 'react-icons/all'
import ScrollToBottom from 'react-scroll-to-bottom'
import firebase from 'firebase/compat'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firebaseConfig } from '../../../repository/firebase_auth' 
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const storage = getStorage()
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const uploadFiles = async (file) => {
  // if there is no file, return null
  console.log('upload file')
  if (!file) return null
  console.log('uploading file')
  // newfilename is a random string
  const newFileName = uuidv4()
  // creates a reference to a new file
  const storageRef = ref(storage, `/images/${newFileName}`)
  // uploads file to the given reference
  const uploadTask = await uploadBytesResumable(storageRef, file)
  const url = await getDownloadURL(uploadTask.ref)
  console.log('finished upload')
  return url
}

export function GroupChatContainer({ group, toolbarHidden, user }) {
  const groupId = group.groupid
  const messagesRef = firestore.collection(`groups/${groupId}/messages`)
  const query = messagesRef.orderBy('createdAt')//.limit(25)
  // Hook for input value (send message)
  const [messages] = useCollectionData(query, { idField: 'id' })

  const sendMessage = async (text, url) => {
    if(url){
      url = await uploadFiles(url.target.files[0])
      console.log('uploaded url:',url)
    }
    console.log('sendMessage', text)
    console.log(user)
    // retrieves uid and photo from the current user
    const { userID, photoURL } = user
    // Post Message Data into Firestore
    await messagesRef.add({
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: userID,
      photoURL,
      // attached file string (url from uploadFiles)
      attachedF: url,
    })
  }

  const height = window.innerHeight - 64 + 'px'

  return (
    <div className={'content-container'}>
      <TopNavigation group={group} toolbarHidden={toolbarHidden} />
      <div className={'content-list'} style={{ height: height }}>
        {messages &&
          messages.map((message, index) => {
            return <Message key={index} message={message} />
          })}
      </div>

      <BottomBar onSend={(message,photoURL) => sendMessage(message, photoURL)} />
    </div>
  )
}

function Message({ message }) {
  return (
    <div className={'message-container'}>
      <img className={'message-image'} src={message.attachedF} />
      <div className={'message-text'}>{message.text}</div>
    </div>
  )
}

const BottomBar = ({ onSend }) => {
  var file=null
  function onFileUploaded(fileObj){
    file=fileObj
    checkFile()
  }
  function checkFile(){
    console.log(file.target.files[0])
  }
  return (
    <div className="bottom-bar">
      <PlusIcon onFileUploaded={(f)=>onFileUploaded(f)} />
      <input
        type="text"
        id={'chatInput'}
        placeholder="Enter message..."
        className="bottom-bar-input"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSend(e.target.value, file)
            file=null
            e.target.value = ''
          }
        }}
      />
      <SendIcon
        onClick={(e) => {
          //get the value of input from chatInput and send it to onSend
          onSend(document.getElementById('chatInput').value, file)
          file=null
          document.getElementById('chatInput').value = ''
        }}
      />
    </div>
  )
}

const Post = ({
  name,
  timestamp,
  text,
  photoURL = 'https://avatars.dicebear.com/api/open-peeps/1.svg',
}) => {
  const seed = Math.round(Math.random() * 100)
  return (
    <div className={'post'}>
      <div className="avatar-wrapper">
        <img src={photoURL} alt="" className="avatar" />
      </div>

      <div className="post-content">
        <p className="post-owner">
          {name}
          <small className="timestamp">{timestamp}</small>
        </p>
        <p className="post-text">{text}</p>
      </div>
    </div>
  )
}

const PlusIcon = ({ onFileUploaded }) => {
  const fileUpload = useRef(null)
  const uploadProfilePic = (e) => {
    onFileUploaded(e)
    console.log(e)
  }

  const handleUpload = () => {
    console.log(fileUpload.current.click(), 'fileUpload')
  }

  return (
    <div>
      <div style={{ height: 0, width: 0 }}>
        <input
          type="file"
          ref={fileUpload}
          onChange={uploadProfilePic}
          style={{ opacity: '0' }}
        />
      </div>
      <BsPlusCircleFill
        size="22"
        className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"
        onClick={handleUpload}
        style={{ cursor: 'pointer' }}
      />
    </div>
  )
}

const SendIcon = ({ onClick }) => (
  <BiSend
    size="22"
    className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  />
)
