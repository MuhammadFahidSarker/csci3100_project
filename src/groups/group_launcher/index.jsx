import {Component} from "react";
import {getAllGroups, getGroupDetails, getJoinedGroups, getUserDetails} from "../../repository/repo";
import {LoadingScreen} from "../../common/loading";
import {Navigate} from "react-router-dom";
import SideBar from "../../home_screen/components/SideBar";
import Channelbar from "../../home_screen/components/ChannelBar";
import ContentContainer from "../../home_screen/components/ContentContainer";
import TopNavigation from "../../home_screen/components/TopNavigation";
import GroupPreview from "./components/group_prev";
import {Loader} from "../../common/loading_anim";

export default class GroupLauncher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginRequired: null,
            user: null,
            groups: null,
            searchTerm: '',
            viewGroupOf: 'joined',
        }
    }

    async componentDidMount() {
        let user, groups;

        user = await getUserDetails();
        if (user.success === false) {
            this.setState({loginRequired: true});
            console.log(user.error);
            return;
        }

        try {
            groups = await getJoinedGroups(user.userID);
            if (groups.success) {
                groups = groups.groups
            } else {
                groups = null;
            }
        } catch (e) {
            groups = [];
        }

        this.setState({user, groups, loginRequired: false});
    }

    filteredGroup = () => {
        const {groups, searchTerm} = this.state;
        if (searchTerm === '') {
            return groups;
        }
        return groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    changeGroupView = async (view) => {
        if (view === this.state.viewGroupOf) {
            return;
        }
        this.setState({groups: null, viewGroupOf: view});
        let groups = view === 'joined' ? await getJoinedGroups(this.state.user.userID) : await getAllGroups();
        if (groups.success) {
            groups = groups.groups
        } else {
            groups = [];
        }


        this.setState({groups});

    }

    render() {
        const {loginRequired, viewGroupOf, user, groups} = this.state;

        if (loginRequired === null) {
            return <LoadingScreen withTopNav={false}/>
        }

        if (loginRequired === true || user === null) {
            return <Navigate to={'/login'}/>
        }

        if (user.isBanned === true) {
            return <Navigate to={'/banned'}/>
        }

        if (user.isVerified === false) {
            return <Navigate to={'/verify-user'}/>
        }

        return (
            <div style={{display: 'flex'}}>

                <div className={'content-container'} style={{height: window.innerHeight, width: window.innerWidth}}>

                    <TopNavigation user={user} showCreateGroup={true}
                                   onSearch={(search) => this.setState({searchTerm: search})}/>

                    <div style={{display: 'flex', gap: '20px', marginTop: '10px', marginBottom:'20px'}}>
                        <button className={viewGroupOf === 'joined' ? 'selected-btn' : 'un-selected-btn'}
                                onClick={(_) => this.changeGroupView('joined')}>My Groups
                        </button>
                        <button className={viewGroupOf === 'public' ? 'selected-btn' : 'un-selected-btn'}
                                onClick={(_) => this.changeGroupView('public')}>All Groups
                        </button>
                    </div>

                    {
                        groups === null ? <div className={'center'}>
                                <Loader/>
                            </div>
                            : groups.length === 0 ? <div className={'center'}>
                                <div className={'no-group-found'}>No Group Found</div>
                                </div>
                                : <div className={'content-list'} style={{display: 'flex'}}>
                                    {this.filteredGroup().map(group => {
                                        return <GroupPreview group={group} userID={user.userID} onGroupLeaved={() => {
                                            if (viewGroupOf === 'joined') {
                                                this.setState({groups: groups.filter(g => g.groupid !== group.groupid)})
                                            }
                                        }}/>
                                    })}
                                </div>
                    }
                </div>
            </div>
        );
    }
}

