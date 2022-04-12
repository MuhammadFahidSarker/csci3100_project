import TopNavigation from '../TopNavigation'
import {BsPlusCircleFill} from 'react-icons/bs'
import React, {useState} from 'react'
import {AiFillCloseCircle, BiSend, FiFile} from 'react-icons/all'
import firebase from 'firebase/compat'

import {useCollectionData} from 'react-firebase-hooks/firestore'
import {firebaseConfig} from '../../../repository/firebase_auth'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import {getDownloadURL, getStorage, ref, uploadBytesResumable,getMetadata } from 'firebase/storage'
import {v4 as uuidv4} from 'uuid'
import './groupchat.css'


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
  const newFileName = uuidv4()+'.'+file.name.split('.').pop()
  // creates a reference to a new file
  const storageRef = ref(storage, `/images/${newFileName}`)
  // uploads file to the given reference
  const uploadTask = await uploadBytesResumable(storageRef, file)
  const url = await getDownloadURL(uploadTask.ref)
  const metadata = await getMetadata(uploadTask.ref)
  return [url,metadata]
}


export function GroupChatContainer({group, toolbarHidden, user}) {
    const groupId = group.groupid
    const messagesRef = firestore.collection(`groups/${groupId}/messages`)
    const query = messagesRef.orderBy('createdAt')//.limit(25)
    // Hook for input value (send message)
    const [messages] = useCollectionData(query, {idField: 'id'})
    var url= null
    var metadata = null

    const [searchField, setSearchField] = useState('')

    const sendMessage = async (text, file) => {
        if(text === '' && file === null) return
        console.log(user, text, file)
        // retrieves uid and photo from the current user

        //upload file
        if(file!==null){
          [url,metadata] = await uploadFiles(file)
          console.log('finished upload:',url,metadata)
        }
        const {userID, photoURL} = user
        // Post Message Data into Firestore
        await messagesRef.add({
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: userID,
            photoURL,
            // attached file string (url from uploadFiles)
            attachedF: url,
            metadata: JSON.stringify(metadata)
        })
    }

    function getFilteredMessages(){
      if(searchField === '') return messages
        if(messages === null || messages === undefined) return [];
        return messages.filter(message => {
          return message.text.toLowerCase().includes(searchField.toLowerCase())
      })
    }


    return (
        <div className={'content-container'}>
            <TopNavigation onSearch={setSearchField} showAllGroup={true} user={user} group={group} toolbarHidden={toolbarHidden}/>
            <div className={'content-list'} style={{marginBottom:'40px',  padding:'20px', paddingBottom:'40px'}}>
                {messages && getFilteredMessages().map((message, index) => {
                        return <Message key={index} userID={user.userID} message={message}/>
                    })}
            </div>
            <BottomBar onSend={(message, file) => sendMessage(message, file)}/>
        </div>
    )
}

function Message({message, userID}) {
    const {text, uid, createdAt, photoURL, attachedF} = message
    const type = uid === userID ? 'self' : 'other';
    return (
        <div className={'message-container message-' + type}>
            {type === 'other' ? <img className={'message-avatar'} src={photoURL} alt={'avatar'}/> : null}
            {/*{attachedF && <img className={'message-image'} src={attachedF}/>}*/}
            <div>
                <div className={'message-text'}>{text}</div>
                {attachedF ? <div className={'url-container'}>
                    <FiFile size={20}/>
                    <a href={attachedF} download>Download</a>
                </div> : null}
            </div>
            {type === 'self' ? <img className={'message-avatar'} src={photoURL} alt={'avatar'}/> : null}

        </div>

    )
}

const BottomBar = ({onSend}) => {

    const [file, setFile] = useState(null)


    return (
        <div className={file === null ? 'bottom-bar' : 'bottom-bar-with-file'}>
            <PlusIcon onFileUploaded={(file) => setFile(file)}/>

            <div style={{justifyItems: 'left', width: '100%'}}>
                {file === null ? null :
                    <div className={'chat-file-container'}>
                        <FiFile/>
                        <span>{file.name}</span>
                        <AiFillCloseCircle style={{marginLeft: '10px', color: 'orangered', cursor: 'pointer'}}
                                           onClick={(_) => setFile(null)}/>
                    </div>}
                <input
                    type="text"
                    id={'chatInput'}
                    placeholder="Enter message..."
                    className="bottom-bar-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSend(e.target.value, file)
                            setFile(null)
                            e.target.value = ''
                        }
                    }}
                />
            </div>
            <SendIcon
                onClick={(e) => {
                    //get the value of input from chatInput and send it to onSend
                    onSend(document.getElementById('chatInput').value, file)
                    document.getElementById('chatInput').value = ''
                    setFile(null)
                }}
            />
        </div>
    )

}




const PlusIcon = ({onFileUploaded}) => {

    function fileUploadButton() {
        document.getElementById('fileButton').click();
        document.getElementById('fileButton').onchange = () => {
            onFileUploaded(document.getElementById('fileButton').files[0]);
        }
    }

    return (
        <div>
            <input id="fileButton" type="file" hidden/>
            <BsPlusCircleFill
                size="22"
                className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"
                style={{cursor: 'pointer'}}
                onClick={fileUploadButton}
            />

        </div>
        /* <div >
             {/!*<BsPlusCircleFill*!/}
             {/!*    size="22"*!/}
             {/!*    className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"*!/}
             {/!*    onClick={handleUpload}*!/}
             {/!*    style={{cursor: 'pointer'}}*!/}
             {/!*!/>*!/}
         </div>*/
    )
}

const SendIcon = ({onClick}) => (
    <BiSend
        size="22"
        className="text-green-500 dark:shadow-lg mx-2 dark:text-primary"
        style={{cursor: 'pointer'}}
        onClick={onClick}
    />
)
