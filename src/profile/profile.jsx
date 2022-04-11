import TopNavigation from "../home_screen/components/TopNavigation";
import './profile.css'
import '../index.css'
import {BiError, BiLogOut, BiWindowClose} from "react-icons/all";
import useDarkMode from "../home_screen/hooks/useDarkMode";
import {useEffect, useState} from "react";
import {getJoinedGroups, getUserDetails} from "../repository/repo";
import {Navigate} from "react-router-dom";

export function ProfileScreen({}) {
    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [signedIn, setSignedIn] = useState(null);

    useEffect(() => {


        getUserDetails().then(res => {
            if (res.success === true) {
                getJoinedGroups(res.userID).then(res => {
                    if (res.success === true) {
                        setGroups(res.response);
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


    return <div className={'content-container'}>
        {
            signedIn === null ?
                <div className={'loader'}/> :
                signedIn === false ?
                    <Navigate to={'/login'}/> :
                [<TopNavigation/>,
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
                                    {user.isVerified === true ? <div className={'verified'}>Verified</div> :
                                        <div className={'not-verified'}><BiError/> Not Verified </div>}
                                    <div className={'logout-button'}><BiLogOut/> Logout</div>
                                </div>
                                <img src={user.photoURL}
                                     style={{width: '240px', height: '240px', borderRadius: '500px'}}/>
                            </div>
                            <ul className={'group-tag-group'}>
                                {groups.map(group => <li className={'group-tag'}>{group.name}</li>)}
                            </ul>
                        </div>
                    </div>]
        }

    </div>
}