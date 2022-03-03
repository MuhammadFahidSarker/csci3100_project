import Channelbar from './components/ChannelBar';
import ContentContainer from './components/ContentContainer';
import SideBar from './components/SideBar';
import {Component} from "react";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'Group Chat'
        }
    }

    render() {
        return (
            <div className="flex">
                <SideBar/>
                <Channelbar changeType = {this.setType} />
                <ContentContainer type = {this.state.type} />
            </div>
        );
    }

    setType = (newType) =>{
        //console.log(newType)
        this.setState({type: newType})
    }

}


export default App;
