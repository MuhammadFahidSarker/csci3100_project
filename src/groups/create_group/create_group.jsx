import TopNavigation from "../../home_screen/components/TopNavigation";
import './creategroup.css'
import {TextInput} from "../../common/input/textinput";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createGroup} from "../../repository/repo";
import {Loader} from "../../common/loading_anim";

export function CreateGroup({}) {

    const contentHeight = window.innerHeight - 64 + 'px';
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    async function createTheGroup() {
        setError('');
        setLoading(true);
        if (name === '') {
            setError('Group name is required');
            setLoading(false);
            return;
        }

        if(description === '') {
            setError('Group description is required');
            setLoading(false);
            return;
        }

        const res = await createGroup(name, description);
        if(res.success === true) {
            navigate('/groups/'+res.groupId);
        } else {
            setError(res.error);
            setLoading(false);
        }
    }

    return <div>
        <TopNavigation showAllGroup={true}/>
        <div className={'content-container'} style={{padding: '20px', height: contentHeight,}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {loading ? <Loader/> : [<div style={{justifyContent: 'center'}}>
                    <div className={'new-group-title'}>Create New Group!</div>
                    <div className={'new-group-desc'}>Lets Connect!</div>
                    <TextInput label={'Name'} placeHolder={'Group Name'} onChange={setName}/>
                    <TextInput label={'Description'} multiline={true} placeHolder={'Group Description'}
                               onChange={setDescription}/>
                    {error ? <div style={{textAlign: 'center', color: 'red'}}>{error}</div> : null}

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button className={'create-group-button'} onClick={createTheGroup}>Create Group</button>
                    </div>
                </div>]}
            </div>
        </div>

    </div>
}