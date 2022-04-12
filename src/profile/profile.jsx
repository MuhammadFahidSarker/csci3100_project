import TopNavigation from "../home_screen/components/TopNavigation";
import './profile.css'
import '../index.css'
import {BiError, BiLogOut, BiWindowClose} from "react-icons/all";
import useDarkMode from "../home_screen/hooks/useDarkMode";
import React, {useEffect, useState} from "react";
import {getJoinedGroups, getUserDetails, logout, uploadUserIcon} from "../repository/repo";
import {Navigate} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {BsPlusCircleFill} from "react-icons/bs";

import firebase from 'firebase/compat'
import {firebaseConfig} from '../repository/firebase_auth'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import {getDownloadURL, getStorage, ref, uploadBytesResumable,getMetadata } from 'firebase/storage'
import {v4 as uuidv4} from 'uuid'

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const storage = getStorage()

const uploadFiles = async (file) => {
  // if there is no file, return null
  console.log('upload file')
  if (!file) return null
  console.log('uploading file')
  // newfilename is a random string
  const newFileName = uuidv4()+'.'+file.name.split('.').pop()
  // creates a reference to a new file
  const storageRef = ref(storage, `/userPhoto/${newFileName}`)
  // uploads file to the given reference
  const uploadTask = await uploadBytesResumable(storageRef, file)
  const url = await getDownloadURL(uploadTask.ref)
  const metadata = await getMetadata(uploadTask.ref)
  return [url,metadata]
}


export function ProfileScreen({}) {
    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [signedIn, setSignedIn] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserDetails().then(res => {
            if (res.success === true) {
                getJoinedGroups(res.userID).then(res => {
                    if (res.success === true) {
                        setGroups(res.groups);
                    }
                });
                setUser(res);
                setSignedIn(true);
            } else {
                setSignedIn(false);
            }
        })
    }, []);

    const height = window.innerHeight - 64 + 'px';


    async function updateProfilePhoto(file){
        if(!file) return
        console.log('debug-updateProfilePhoto:', file)
        let [url,metadata] = await uploadFiles(file)

        console.log('uploaded photo,',url)
        uploadUserIcon(url).then(getUserDetails().then(res => {
            if (res.success === true) {
                getJoinedGroups(res.userID).then(res => {
                    if (res.success === true) {
                        setGroups(res.groups);
                    }
                });
                setUser(res);
                setSignedIn(true);
            } else {
                setSignedIn(false);
            }
        }))
    }

    return <div className={'content-container'}>
        {
            signedIn === null ?
                <div className={'center'}>
                    <div className={'loader'}/>
                </div> :
                signedIn === false ?
                    <Navigate to={'/login'}/> :
                    [<TopNavigation showAllGroup={true}/>,
                        <div style={{
                            display: 'flex',
                            height: height,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div className={'profile'}>
                                    <div>
                                        <div className={'name'}>{user.name}</div>
                                        <div className={'logout-button'} onClick={()=>{
                                            logout().then(()=> {
                                                    setSignedIn(false);
                                                }
                                            )
                                        }}><BiLogOut/> Logout</div>
                                    </div>
                                    <ProfilePhoto user={user} onFileUploaded={updateProfilePhoto}/>
                                </div>
                                <ul className={'group-tag-group'}>
                                    {groups.map(group => <li className={'group-tag'}
                                                             onClick={() => navigate('/groups/' + group.groupid)}>{group.name}</li>)}
                                </ul>
                            </div>
                        </div>]
        }

    </div>
}

const ProfilePhoto = ({user, onFileUploaded}) => {

    function fileUploadButton() {
        document.getElementById('fileButton').click();
        document.getElementById('fileButton').onchange = () => {
            onFileUploaded(document.getElementById('fileButton').files[0]);
        }
    }

    return (
        <div>
            <input id="fileButton" type="file" accept="image/png, image/gif, image/jpeg" hidden/>
            <img className={'profile-photo'} src={user.photoURL}
                 style={{
                     width: '240px',
                     height: '240px',
                     borderRadius: '500px',
                     cursor: 'pointer'
                 }} onClick={fileUploadButton}/>

        </div>
    )
}