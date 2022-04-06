import Channelbar from './components/ChannelBar';
import ContentContainer from './components/ContentContainer';
import SideBar from './components/SideBar';
import {Component} from "react";
import './home.css'
import {getGroupDetails, getUserDetails, isUserLoggedIn} from "../repository/repo";
import { Navigate } from 'react-router-dom';
import {LoadingScreen} from "../common/loading";
import { useLocation } from 'react-router-dom'

function Home (props) {
    const location = useLocation();

    return <HomeComponent {...props} groupID={location.pathname.split('/')[2]}/>
}

const GROUP_NOT_FOUND = 'Group Not Found!';
const USER_NOT_SIGNED_IN = 'You need to sign in!';

class HomeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'Group Chat',
            loginRequired:null,
            toolbarHidden:false,
            user:null,
            group:null,
            error: null,
        }
    }

    async componentDidMount() {
        let user, error, group;

        try {
            user = await getUserDetails();
        } catch (e){
            user = null;
        }

        if(user === null){
            this.setState({loginRequired: true});
            return;
        }

        try {
            group = await getGroupDetails();
        }catch (e){
            group = null;
        }



        error =  group === null ? GROUP_NOT_FOUND :  null;
        this.setState({user, group, error, loginRequired: false});
    }

    handleMainBarOnclick = (type) => {
        if(type === 'hide_show'){
            this.setState({toolbarHidden: !this.state.toolbarHidden});
        }
    }

    render() {
        const {type, loginRequired, toolbarHidden, user, error, group} = this.state;
        const {groupID} = this.props;

        if(loginRequired === null){
            return <LoadingScreen withTopNav={false}/>
        }

        if(loginRequired === true || user === null){
            return <Navigate to={'/login'}/>
        }

        if(group === null && error === GROUP_NOT_FOUND){
            return <Navigate to={'/group_launcher'}/>
        }else if(group === null){
            return <h1>Unknown Error occured!</h1>
        }

        return (
            <div className="flex">
                <SideBar onClick={this.handleMainBarOnclick} user={user}/>
                {toolbarHidden ? null : <Channelbar changeType = {this.setType} /> }
                <ContentContainer group={group} toolbarHidden={toolbarHidden} user={user} type = {this.state.type} />
            </div>
        );
    }

    setType = (newType) =>{
        console.log(newType);
        this.setState({type: newType})
    }

}


export default Home;
