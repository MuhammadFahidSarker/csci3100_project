import TopNavigation from "../home_screen/components/TopNavigation";
import {LoadingScreen} from "../common/loading";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {banUser, getAllGroups, getAllUsers, getUserDetails, resetPasswordEmail} from "../repository/repo";
import './admin.css'
import {Loader} from "../common/loading_anim";

/**
 * Admin page
 * @param props
 * @returns {ui}
 * **/
export function AdminScreen({}) {

    /**
     * variables to display ui conditionally
     * user is null initially
     * loading and dataLoading is true initially
     * viewMode is groups initially
     * groups and users are empty initially
     * error is empty initially
     * **/
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('groups');
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [dataLoading, setDataLoading] = useState(true);

    /**
     * get the users and initialize it
     * set loading to false
     * if the user is not admin, set the user to null
     * **/
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

    /**
     * @param viewMode
     * load the data based on the viewMode
     * */
    function changeViewMode(mode) {
        if (mode === viewMode)
            return;
        setViewMode(mode);
        loadData(mode)
    }

    /**
     * @param viewMode
     * load the data based on the viewMode
     * */
    function loadData(mode) {
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

    /**
     * Data is still loading --> show loading screen
     * **/
    if (loading === true) {
        return <LoadingScreen withTopNav={false}/>
    }

    /**
     * User is not logged in --> show login screen
     * **/
    if (user === null) {
        return <Navigate to={'/admin-login'}/>
    }


    /**
     * User is logged in and user is admin --> show admin page
     * **/
    return <div className={'content-container'}>
        <TopNavigation showNormalModeIcon={true} hideAdminIcon={true} forceName={'Admin Mode'} user={user}/>
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
                dataLoading ? <div className={'center'}>
                        <Loader/>
                    </div>
                    : <ul className={'group-user-container'}>
                        {viewMode === 'groups' ?
                            groups.map(grp => <AdminGroup group={grp}/>)
                            : users.map(user => <AdminUser user={user}/>)}
                    </ul>
            }
        </div>
    </div>
}

/**
 * @param group
 * @returns {AdminGroup}
 * returns the ui of admin group
 * **/
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

/***
 * @param user
 * @returns {*}
 * **/
function AdminUser({user}) {
    const [banned, setBanned] = useState(user.isBanned);
    const [loading, setLoading] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const navigate = useNavigate();

    /**
     * Ban @param user
     * **/
    function banThisUser() {
        setLoading(true);
        banUser(user.userid).then(res => {
            console.log(res);
            if (res.success === true) {
                setBanned(true);
            }
            setLoading(false);
        })

    }

    /**
     * Reset @param user's password
     * **/
    function resetPass(){
        setLoading(true);
        resetPasswordEmail(user.email).then(res => {
            if (res.success === true) {
                setResetEmailSent(true);
            }
            setLoading(false);
        })
    }

    /**
     * Returns the admin user view
     * **/
    return <li>
        <div className={'user-container'}>
            <div className={'center'}>
                <img className={'grp-img'} src={user.profile_icon}/>
            </div>
            <div className={'name'}>{user.name}</div>
            <div>{user.email}</div>
            {user.role === 'admin' ?
                <div className={'center'}>
                    <div className={'admin-label'}>Admin</div>
                </div> :
                loading ? <div className={'center'}>
                <Loader width={'60px'} height={'60px'}/>
            </div> : banned ? <div className={'banned'}>Banned</div> :
                <div className={'ban-button'} onClick={banThisUser}>Ban User</div>
            }
            {(loading || banned) ? null : resetEmailSent ? <div>
                <div className={'center'}>
                    <div className={'success-label'}>Reset Email Sent</div>
                </div>
            </div> : <div className={'reset-button'} onClick={resetPass}>Reset Password</div>}
            {(loading || banned) ? null :  <div className={'reset-button'} onClick={()=>navigate('/admin/users/'+user.userid+'/change-password')}>Change Password</div>}
        </div>
    </li>
}