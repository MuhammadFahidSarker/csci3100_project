import Channelbar from './components/ChannelBar';
import ContentContainer from './components/ContentContainer';
import SideBar from './components/SideBar';
import {Component} from "react";
import './home.css'
import {getUserDetails, isUserLoggedIn} from "../repository/repo";
import { Navigate } from 'react-router-dom';
import {LoadingScreen} from "../common/loading";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'Group Chat',
            loginRequired:null,
            toolbarHidden:false,
            user:null,
        }
    }

    componentDidMount() {
        getUserDetails().then(details => {
            this.setState({loginRequired: details === null, user: details});
        })
    }

    handleMainBarOnclick = (type) => {
        if(type === 'hide_show'){
            this.setState({toolbarHidden: !this.state.toolbarHidden});
        }
    }

    render() {
        const {type, loginRequired, toolbarHidden, user} = this.state;
        if(loginRequired === null){
            return <LoadingScreen/>
        }
        if(loginRequired === true || user === null){
            return <Navigate to={'/login'}/>
        }
        return (
            <div className="flex">
                <SideBar onClick={this.handleMainBarOnclick} user={user}/>
                {toolbarHidden ? null : <Channelbar changeType = {this.setType} /> }
                <ContentContainer toolbarHidden={toolbarHidden} user={user} type = {this.state.type} />
            </div>
        );
    }

    setType = (newType) =>{
        console.log(newType);
        this.setState({type: newType})
    }

}


export default Home;
