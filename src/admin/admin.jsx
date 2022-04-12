import TopNavigation from "../home_screen/components/TopNavigation";
import {LoadingScreen} from "../common/loading";
import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {banUser, getAllGroups, getAllUsers, getUserDetails} from "../repository/repo";
import './admin.css'

export function AdminScreen({}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('groups');
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(
        () => {
            getUserDetails().then(
                user => {
                    if ((user.success === true) && user.isAdmin === true) {
                        setUser(user);
                        setLoading(false);
                        loadData(viewMode)
                    } else {
                        setLoading(false);
                    }
                }
            )
        }, []
    )


    function changeViewMode(mode) {
        if (mode === viewMode)
            return;
        setViewMode(mode);
        loadData(mode)
    }


    function loadData(mode){
        setDataLoading(true);
        if (mode === 'groups') {
            getAllGroups().then((grps => {
                setUsers([]);
                if (grps.success === true) {
                    setGroups(grps.groups);
                } else {
                    setError('Error getting all groups!');
                }
                setDataLoading(false);
            }));
        } else {
            getAllUsers().then((users => {
                setGroups([]);
                if (users.success === true) {
                    setUsers(users.users);
                } else {
                    setError('Error getting all users!');
                }
                setDataLoading(false);
            }));
        }
    }


    console.log(users)

    if (loading === true) {
        return <LoadingScreen withTopNav={false}/>
    }

    if (user === null) {
        return <Navigate to={'/admin-login'}/>
    }


    return <div className={'content-container'}>
        <TopNavigation hideAdminIcon={true} forceName={'Admin Mode'} user={user}/>
        <div className={'content-list'}>
            <div className={'row'} style={{marginTop: '20px'}}>
                <button className={viewMode === 'groups' ? 'selected-btn' : 'un-selected-btn'}
                        onClick={(_) => changeViewMode('groups')}>Groups
                </button>
                <button className={viewMode === 'users' ? 'selected-btn' : 'un-selected-btn'}
                        onClick={(_) => changeViewMode('users')}>Users
                </button>
            </div>
            {
                dataLoading ? <div className={'center'}><div className={'loader'}/> </div>
                    : <ul className={'group-user-container'}>
                        {viewMode === 'groups' ?
                            groups.map(grp => <AdminGroup group={grp}/>)
                            : users.map(user => <AdminUser user={user}/>)}
                    </ul>
            }
        </div>
    </div>
}

function AdminGroup({group}) {
    return <li className={'group-container'}>
        <div>
            <div className={'center'}>
                <img className={'grp-img'} src={group.group_icon}/>
            </div>
            <div className={'name'}>{group.name}</div>
            <div className={'group-description'}>{group.description}</div>
        </div>
    </li>
}

function AdminUser({user}) {
    const [banned, setBanned] = useState(user.isBanned);
    const [loading, setLoading] = useState(false);

    function banThisUser(){
        setLoading(true);
        banUser(user.userid).then(res => {
            if (res.success === true) {
                setBanned(true);
            }
            setLoading(false);
        })

    }

    return <li>
        <div className={'user-container'}>
            <div className={'center'}>
                <img className={'grp-img'} src={user.profile_icon}/>
            </div>
            <div className={'name'}>{user.name}</div>
            <div>{user.email}</div>
            {
                loading ? <div className={'loader'}/> : banned ? <div className={'banned'}>Banned</div> : <div className={'ban-button'} onClick={banThisUser}>Ban User</div>
            }
        </div>
    </li>
}