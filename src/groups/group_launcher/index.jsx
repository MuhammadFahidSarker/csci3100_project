import {Component} from "react";
import {getGroupDetails, getJoinedGroups, getUserDetails} from "../../repository/repo";
import {LoadingScreen} from "../../common/loading";
import {Navigate} from "react-router-dom";
import SideBar from "../../home_screen/components/SideBar";
import Channelbar from "../../home_screen/components/ChannelBar";
import ContentContainer from "../../home_screen/components/ContentContainer";
import TopNavigation from "../../home_screen/components/TopNavigation";
import GroupPreview from "./components/group_prev";

export default class GroupLauncher extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loginRequired:null,
            user:null,
            groups:[],
        }
    }

    async componentDidMount() {
        let user, groups;

        user = await getUserDetails();
        if(user.success === false){
            this.setState({loginRequired:true});
            console.log(user.error);
            return;
        }

        try {
            groups = await getJoinedGroups(user.userID);
            if(groups.success){
                groups=groups.response
            }else{
                groups = [];
            }
        }catch (e){
            groups = [];
        }

        this.setState({user, groups, loginRequired: false});
    }

    render() {
        const {loginRequired, user, groups} = this.state;

        if(loginRequired === null){
            return <LoadingScreen withTopNav={false}/>
        }

        if(loginRequired === true || user === null){
            return <Navigate to={'/login'}/>
        }

        return (
            <div className={'content-container'} style={{height:window.innerHeight, width:window.innerWidth}}>
                <TopNavigation showCreateGroup={true}/>
                <div className={'content-list'} style={{display:'flex'}}>
                    {groups.map(group => {
                        return <GroupPreview group={group}/>
                    })}
                </div>
            </div>
        );
    }
}

