import './group_prev.css'
import {Button} from "next-gen-ui";
import useDarkMode from "../../../home_screen/hooks/useDarkMode";
import {useNavigate} from "react-router-dom";
import {BiArrowBack, FcLeave, FiEdit, RiAdminFill} from "react-icons/all";
import {joinGroup, leaveGroup} from "../../../repository/repo";
import {useState} from "react";
import {LoadingScreen} from "../../../common/loading";
import {Loader} from "../../../common/loading_anim";

export default function GroupPreview({onGroupLeaved, group, userID}) {
    let navigate = useNavigate();
    const gMembers = group.members;
    const members = gMembers?.length | 0;
    const isMember = gMembers?.includes(userID);
    const [action, setAction] = useState(isMember ? 'Launch' : 'Join');
    console.log(gMembers, userID, action, gMembers.includes(userID));

    const admins = group.admins;
    const isAdmin = admins?.includes(userID);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


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

    async function launchGroup() {
        navigate('/groups/' + group.groupid)
    }

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

    console.log(group);

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