import {useLocation} from 'react-router-dom'
import {useEffect, useState} from "react";
import {getGroupDetails, getGroupMembers} from "../../repository/repo";
import {LoadingScreen} from "../../common/loading";
import TopNavigation from "../../home_screen/components/TopNavigation";
import {TextInput} from "../../common/input/textinput";
import {AiFillBackward, AiFillDelete, BiArrowBack, FiDelete, FiEdit} from "react-icons/all";
import {useNavigate} from "react-router-dom";
import './edit_grp.css'

export function EditGroup({}) {
    const location = useLocation();
    const groupId = location.pathname.split('/')[2];
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    useEffect(
        () => {
            getGroupDetails(groupId).then(grp => {
                if (grp.success === true) {
                    setGroup(grp.content);
                } else {
                    console.log(grp.error);
                }
            })
        }, [],
    )

    if (group === null) {
        return <LoadingScreen withTopNav={false}/>
    }

    const height = window.innerHeight - 64 + 'px';

    return (
        <div className={'content-container'}>
            <TopNavigation showAllGroup={true}/>
            <div className={'content-list'} style={{height:height}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '40px'}}>
                    <div>
                        <TextInput label={'Name'} value={group.name} placeHolder={'Group name'}/>
                        <TextInput label={'Description'} multiline={true} value={group.description}
                                   placeHolder={'Group name'}/>
                    </div>
                    <div>
                        <img title={'Edit'} src={group.photoURL} alt={'Group image'} width={'240px'} height={'240px'}
                             style={{cursor: 'pointer', borderRadius: '500px'}}/>

                    </div>
                </div>
                <div style={{display:'flex', gap:'30px'}}>

                    <button><div style={{display:'flex', alignItems:'center'}} onClick={(_)=> navigate('/groups/'+groupId)}><BiArrowBack/>Back</div></button>
                    <button><div style={{display:'flex', alignItems:'center'}}><FiEdit/> Update</div></button>

                </div>
                <div className={'hr-line'}/>
                <div className={'content-list'}>
                    <GroupMembers groupID={groupId}/>
                </div>
            </div>
        </div>
    );
}

function GroupMembers({groupID}){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [members, setMembers] = useState(null);
    useEffect(
        () => {
            getGroupMembers(groupID).then(grp => {
                if (grp.success === true) {
                    setMembers(grp.members);
                } else {
                    console.log(grp.error);
                }
            })
        }, [],
    )

    if (members === null) {
        return <div></div>
    }

    if(members.length === 0)
        return <div>No members</div>

    return <ul className={'group-tag-group'}>
        {members.map(member => <li ><Member member={member}/> </li>)}
    </ul>
}

function Member({member}){
    return <div className={'member-tag'}>
        {member.name}
        <AiFillDelete style={{color:'red', fontSize:24, cursor:'pointer',}}/>
    </div>
}
