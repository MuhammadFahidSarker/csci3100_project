import './group_prev.css'
import {useNavigate} from "react-router-dom";
import {BiArrowBack, FcLeave, FiEdit, RiAdminFill} from "react-icons/all";
import {joinGroup, leaveGroup} from "../../../repository/repo";
import {useState} from "react";
import {Loader} from "../../../common/loading_anim";

/**
 * @description A component that displays the preview of the group showing the name, description, and image.
 * @param onGroupLeaved
 * @param group
 * @param userID
 * @returns {JSX.Element}
 * @constructor
 */
export default function GroupPreview({onGroupLeaved, group, userID}) {

    let navigate = useNavigate(); // used to navigate to the group page
    const gMembers = group.members; // the group members
    const members = gMembers?.length | 0; // the number of members
    const isMember = gMembers?.includes(userID); // whether the user is a member of the group
    const [action, setAction] = useState(isMember ? 'Launch' : 'Join'); // the action to be performed
    const admins = group.admins; // the group admins
    const isAdmin = admins?.includes(userID); // whether the user is an admin of the group
    const [error, setError] = useState('');    // the error message
    const [loading, setLoading] = useState(false); // whether the action is being performed

    /**
     * @description join a new group and if successful, navigate to the group page
     * @returns {Promise<void>}
     */
    async function joinNewGroup() {
        setLoading(true);
        const res = await joinGroup(group.groupid);
        if (res.success) {
            navigate(`/groups/${group.groupid}`);
        } else {
            setLoading(false);
            setError('Could not join group: Unknown Error!');
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async function launchGroup() {
        navigate('/groups/' + group.groupid)
    }

    /**
     * @description leave a group and if successful, call the onGroupLeaved callback
     * @returns {Promise<void>}
     */
    async function leaveTheGroup() {
        setLoading(true);
        const res = await leaveGroup(group.groupid);
        if (res.success) {
            setAction('Join');
            setLoading(false);
            onGroupLeaved();
        } else {
            setLoading(false);
            setError('Could not leave group: Unknown Error!');
        }
    }


    return <div className={'prev'} style={{
        display: 'flex', fontSize: '40px',
        margin: '5px', marginLeft: '80px', marginRight: '80px',
        padding: '30px',
        justifyContent: 'space-between', alignItems: 'center',
        borderRadius: '10px', width: '80%',
    }}>
        <div style={{display: 'flex', gap: '20px'}}>
            <img src={group.group_icon} style={{borderRadius: '500px', width: '120px', height: '120px'}}/>
            <div>
                {group.name}
                <div style={{fontSize: '20px', gap: '20px'}}>
                    <div style={{marginTop: '10px'}}>{group.description}</div>
                    <p>&nbsp;</p>
                    <div>{members === 0 ? 'No Members' : members === 1 ? '1 Member' : `${members} Members`}</div>
                    {isAdmin ? <div style={{display: 'flex', alignItems: 'center'}}>
                        <button onClick={isAdmin ? (_) => navigate('/groups/' + group.groupid + '/edit') : null}>
                            <div style={{display: 'flex', alignItems: 'center'}}><FiEdit/>Edit</div>
                        </button>
                        <RiAdminFill style={{fontSize: '20px', color: '#ff4907'}}/>
                        <div style={{fontSize: '20px', color: '#ff4107'}}>Admin</div>
                    </div> : (action === 'Launch' && loading === false) ? <button onClick={(_) => leaveTheGroup()}>
                        <div style={{display: 'flex', alignItems: 'center'}}><BiArrowBack/>Leave Group</div>
                    </button> : null}
                    {error === '' ? null : <div style={{color: 'red'}}>{error}</div>}
                </div>
            </div>
        </div>
        {loading === true ? <Loader/> :
            <button onClick={(e) => action === 'Launch' ? launchGroup() : joinNewGroup()}>{action}</button>}

    </div>
}