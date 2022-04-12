import TopNavigation from "../home_screen/components/TopNavigation";
import {LoadingScreen} from "../common/loading";
import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {getUserDetails} from "../repository/repo";

export function AdminScreen({}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('groups');

    useEffect(
        ()=>{
            getUserDetails().then(
                user => {
                    if((user.success === true) && user.isAdmin === true){
                        setUser(user);
                        setLoading(false);
                    }else {
                        setLoading(false);
                    }
                }
            )
        }, []
    )


    function changeViewMode(mode){
        setViewMode(mode);
    }

    if(loading === true){
        return <LoadingScreen withTopNav={false}/>
    }

    if(user === null){
        return <Navigate to={'/admin-login'}/>
    }


    return <div className={'content-container'}>
        <TopNavigation hideAdminIcon={true} forceName={'Admin Mode'}  user={user}/>
        <div className={'content-list'}>
            <div style={{display:'flex'}}>
                <button className={viewMode === 'groups' ? 'selected-btn' : 'un-selected-btn'} onClick={(_)=>changeViewMode('groups')}>Groups</button>
                <button className={viewMode === 'users' ? 'selected-btn' : 'un-selected-btn'} onClick={(_)=>changeViewMode('users')}>Users</button>
            </div>
        </div>
    </div>
}