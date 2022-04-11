import './group_prev.css'
import {Button} from "next-gen-ui";
import useDarkMode from "../../../home_screen/hooks/useDarkMode";
import {useNavigate} from "react-router-dom";
import {RiAdminFill} from "react-icons/all";

export default function GroupPreview({group, userID}) {
    let navigate = useNavigate();
    const gMembers = group.members;
    const members = gMembers?.length | 0;
    const action = gMembers ? gMembers.includes(userID) ? 'Launch' : 'Join' : 'Join';
    const admins = group.admins;
    const isAdmin = admins?.includes(userID);

    return <div className={'prev'} style={{
        display: 'flex', fontSize: '40px',
        margin: '5px', marginLeft: '80px', marginRight: '80px',
        padding: '30px',
        justifyContent: 'space-between', alignItems: 'center',
        borderRadius: '10px', width: '80%',
        cursor: isAdmin ? 'pointer' : 'default',
    }} onClick={isAdmin ? (_) => navigate('/groups/'+group.groupid+'/edit') : null}>
        <div>
            {group.name}
            <div style={{fontSize: '20px', gap: '20px'}}>
                <div style={{marginTop: '10px'}}>{group.description}</div>
                <p>&nbsp;</p>
                <div>{members === 0 ? 'No Members' : members === 1 ? '1 Member' : `${members} Members`}</div>
                {isAdmin ? <div style={{display: 'flex'}}>
                    <RiAdminFill style={{fontSize: '20px', color: '#ffc107'}}/>
                    <div style={{fontSize: '20px', color: '#ffc107'}}>Admin</div>
                </div> : null}
            </div>
        </div>
        <button onClick={(e) => navigate('/groups/' + group.groupid)}>{action}</button>
    </div>
}