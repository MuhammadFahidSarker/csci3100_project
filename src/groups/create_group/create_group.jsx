import TopNavigation from "../../home_screen/components/TopNavigation";
import './creategroup.css'
import {TextInput} from "../../common/input/textinput";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createGroup} from "../../repository/repo";
import {Loader} from "../../common/loading_anim";

/**
 * @description CreateGroup Screen component
 * @returns {JSX.Element}
 * @constructor
 */
export function CreateGroup({}) {

    /**
     * Variables to display the screen conditionally
     */
    const contentHeight = window.innerHeight - 64 + 'px'; // 64px is the height of the top navigation bar
    const [name, setName] = useState(''); // Group name
    const [description, setDescription] = useState(''); // Group description
    const [error, setError] = useState(''); // Error message
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // React router navigate function


    /**
     * @description Creates a new group
     * if the group name and description is not empty
     * @returns {Promise<void>}
     */
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