import './group_prev.css'
import {Button} from "next-gen-ui";
import useDarkMode from "../../../home_screen/hooks/useDarkMode";
import {useNavigate} from "react-router-dom";
import {BiArrowBack, FcLeave, FiEdit, RiAdminFill} from "react-icons/all";
import {joinGroup} from "../../../repository/repo";
import {useState} from "react";
import {LoadingScreen} from "../../../common/loading";

export default function GroupPreview({group, userID}) {
    let navigate = useNavigate();
    const gMembers = group.members;
    const members = gMembers?.length | 0;
    const action = gMembers ? gMembers.includes(userID) ? 'Launch' : 'Join' : 'Join';
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

    return <div className={'prev'} style={{
        display: 'flex', fontSize: '40px',
        margin: '5px', marginLeft: '80px', marginRight: '80px',
        padding: '30px',
        justifyContent: 'space-between', alignItems: 'center',
        borderRadius: '10px', width: '80%',
    }}>
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
                    <RiAdminFill style={{fontSize: '20px', color: '#ffc107'}}/>
                    <div style={{fontSize: '20px', color: '#ffc107'}}>Admin</div>
                </div> : action === 'Launch' ? <button onClick={(_) => navigate('/groups/' + group.groupid + '/edit')}>
                    <div style={{display: 'flex', alignItems: 'center'}}><BiArrowBack/>Leave Group</div>
                </button> : null}
                {error === '' ? null : <div style={{color: 'red'}}>{error}</div>}
            </div>
        </div>
        {loading === true ? <div className={'loader'}/> :
            <button onClick={(e) => action === 'Launch' ? launchGroup() : joinNewGroup()}>{action}</button>}

    </div>
}