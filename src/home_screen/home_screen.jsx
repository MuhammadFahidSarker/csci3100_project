import Channelbar from './components/ChannelBar';
import ContentContainer from './components/ContentContainer';
import SideBar from './components/SideBar';
import {Component} from "react";
import './home.css'
import {getGroupDetails, getUserDetails, isUserLoggedIn} from "../repository/repo";
import { Navigate } from 'react-router-dom';
import {LoadingScreen} from "../common/loading";
import { useLocation } from 'react-router-dom'
import {useNavigate} from "react-router-dom";

function Home (props) {
    const location = useLocation();
    const navigate = useNavigate();

    return <HomeComponent {...props} onNavigate={navigate} groupID={location.pathname.split('/')[2]}/>
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

        user = await getUserDetails();
        if(user.success === false){
            this.setState({loginRequired: true});
        }

        if(user.isVerified === false){
            this.props.onNavigate('/verify-user');
        }


        group = await getGroupDetails(this.props.groupID);
        console.log(group);
        if(group.success === false){
            this.setState({error: GROUP_NOT_FOUND, loginRequired: false});
        }

        console.log(group);

        this.setState({user: user, group: group.content, loginRequired: false});
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

        if(user.isVerified === false){
            return <Navigate to={'/verify-user'}/>
        }

        if(group === null && error === GROUP_NOT_FOUND){
            return <Navigate to={'/groups'}/>
        }else if(group === null){
            return <h1>Unknown Error occured!</h1>
        }

        return (
            <div className="flex">
                {/*<SideBar onClick={this.handleMainBarOnclick} group={group} user={user}/>*/}
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
