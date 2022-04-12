import {useLocation} from 'react-router-dom'
import {useEffect, useState} from "react";
import {deleteGroup, getGroupDetails, getGroupMembers, kickUser} from "../../repository/repo";
import {LoadingScreen} from "../../common/loading";
import TopNavigation from "../../home_screen/components/TopNavigation";
import {TextInput} from "../../common/input/textinput";
import {
    AiFillBackward, AiFillCloseCircle,
    AiFillDelete,
    AiFillRightCircle,
    AiFillWarning, AiOutlineClose, AiOutlineCloseCircle,
    BiArrowBack,
    FiDelete,
    FiEdit, GiConfirmed, IoClose, RiAdminFill
} from "react-icons/all";
import {useNavigate} from "react-router-dom";
import './edit_grp.css'

export function EditGroup({}) {
    const location = useLocation();
    const groupId = location.pathname.split('/')[2];
    const [confirmDel, setConfirmDel] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);

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

    function deleteTheGroup(){
        deleteGroup(groupId).then(res => {
            if (res.success === true) {
                navigate('/groups')
            } else {
                console.log(res.error);
            }
        })
    }

    function updateGroupDetails(){

    }

    if (group === null) {
        return <LoadingScreen withTopNav={false}/>
    }

    const height = window.innerHeight - 64 + 'px';

    if (confirmDel === true) {
        return <div className={'content-container'}>
            <div className={'center'}>
                <div>
                    <div style={{fontSize: '40px'}}>Confirm Delete?</div>
                    <div style={{textAlign: 'center'}}>You can not undo this.</div>
                    <div className={'row'} style={{marginTop:'40px'}}>
                        <button style={{backgroundColor: 'red'}} onClick={()=>deleteTheGroup()}>
                            <div className={'row'}><FiDelete/> Delete Group</div>
                        </button>
                        <button style={{}} onClick={()=>setConfirmDel(false)}>
                            <div className={'row'}><AiFillBackward/> Go Back</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <div className={'content-container'}>
            <TopNavigation showAllGroup={true}/>
            <div className={'content-list'} style={{height: height}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '40px'}}>
                    <div>
                        <TextInput label={'Name'} value={group.name} placeHolder={'Group name'} onChange={setName}/>
                        <TextInput label={'Description'} multiline={true} value={group.description}
                                   placeHolder={'Group name'} onChange={setDescription}/>
                    </div>
                    <div>
                        <img title={'Edit'} src={group.photoURL} alt={'Group image'} width={'240px'} height={'240px'}
                             style={{cursor: 'pointer', borderRadius: '500px'}}/>

                    </div>
                </div>
                <div style={{display: 'flex', gap: '30px'}}>

                    <button>
                        <div style={{display: 'flex', alignItems: 'center'}}
                             onClick={(_) => navigate('/groups/' + groupId)}><BiArrowBack/>Back
                        </div>
                    </button>
                    <button>
                        <div style={{display: 'flex', alignItems: 'center'}}><FiEdit/> Update</div>
                    </button>

                    <button style={{backgroundColor: 'red'}} onClick={()=> setConfirmDel(true)}>
                        <div className={'row'}><FiDelete/> Delete Group</div>
                    </button>

                </div>
                <div className={'hr-line'}/>
                <div className={'content-list'}>
                    <GroupMembers groupID={groupId}/>
                </div>
            </div>
        </div>
    );
}

function GroupMembers({groupID}) {
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

    function removeMember(member) {
        kickUser(member.userid, groupID).then(res => {
            if (res.success) {
                setMembers(members.filter(m => m.userid !== member.userid))
            }
        })
    }

    if (members === null) {
        return <div></div>
    }

    if (members.length === 0)
        return <div>No members</div>

    return <ul className={'group-tag-group'}>
        {members.map(member => <li><Member removeMember={() => removeMember(member)} member={member}/></li>)}
    </ul>
}

function Member({member, removeMember}) {
    const [shouldDel, setShouldDel] = useState(false);
    const isAdmin = member.role === 'admin';

    return <div className={'member-tag'}>
        {member.name}
        {isAdmin ? <div style={{display: 'flex', alignItems: 'center'}}>
                <RiAdminFill style={{fontSize: '20px', color: '#ff4907'}}/>
                <div style={{fontSize: '20px', color: '#ff4107'}}>Admin</div>
            </div>
            : shouldDel === true ?
                [
                    <GiConfirmed style={{color: 'red', fontSize: 24, cursor: 'pointer',}} onClick={removeMember}/>,
                    <AiOutlineCloseCircle style={{color: 'red', fontSize: 24, cursor: 'pointer',}}
                                          onClick={() => setShouldDel(false)}/>
                ]
                :
                <AiFillDelete style={{color: 'red', fontSize: 24, cursor: 'pointer',}}
                              onClick={() => setShouldDel(true)}/>}
    </div>
}
