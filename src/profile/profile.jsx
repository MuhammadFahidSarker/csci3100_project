import TopNavigation from "../home_screen/components/TopNavigation";
import './profile.css'
import '../index.css'
import {BiError, BiLogOut, BiWindowClose} from "react-icons/all";
import useDarkMode from "../home_screen/hooks/useDarkMode";
import {useEffect, useState} from "react";
import {getJoinedGroups} from "../repository/repo";

export function ProfileScreen({user}) {
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        getJoinedGroups(user.userID).then(res => {
            if(res.success === true){
                setGroups(res.response);
            }
        });
    }, []);

    const height = window.innerHeight - 64 + 'px';


    return <div className={'content-container'}>
        <TopNavigation/>
        <div style={{display:'flex', height:height, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <div>
                <div className={'profile'}>
                    <div>
                        <div className={'name'}>{user.name}</div>
                        {user.isVerified === true ? <div className={'verified'}>Verified</div> :
                            <div className={'not-verified'}><BiError/> Not Verified </div>}
                        <div className={'logout-button'}><BiLogOut/> Logout</div>
                    </div>
                    <img src={user.photoURL} style={{width:'240px', height:'240px', borderRadius:'500px'}}/>
                </div>
                <ul className={'group-tag-group'}>
                    {groups.map(group => <li className={'group-tag'}>{group.name}</li>)}
                </ul>
            </div>
        </div>

    </div>
}