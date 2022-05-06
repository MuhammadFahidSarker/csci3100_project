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
import {Loader} from "../common/loading_anim";

firebase.initializeApp(firebaseConfig)  // initialize firebase
const firestore = firebase.firestore()  // initialize firestore
const storage = getStorage() // initialize storage

/**
 * Uploads a file to firebase storage and returns the download url and metadata
 * @param file
 * @returns {Promise<null|(string|FullMetadata)[]>}
 */
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

/**
 * @description profile screen component displays the profile of an user and allows them to modify it
 * @returns {JSX.Element}
 * @constructor
 */
export function ProfileScreen({}) {

    const [groups, setGroups] = useState([]); // groups that the user is a member of
    const [user, setUser] = useState(null); // user details
    const [signedIn, setSignedIn] = useState(null); // signed in status

    const navigate = useNavigate(); // navigate to another page

    useEffect(() => {
        // get user details
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

    /**
     * @description updates the profile photo of the user
     * @param file
     * @returns {Promise<void>}
     */
    async function updateProfilePhoto(file){
        if(!file) return
        let [url,metadata] = await uploadFiles(file)

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
                    <Loader/>
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