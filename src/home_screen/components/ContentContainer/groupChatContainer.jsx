import TopNavigation from "../TopNavigation";
import {BsPlusCircleFill} from "react-icons/bs";
import {Component} from "react";
import {LoadingScreen} from "../../../common/loading";
import {getGroupChats} from "../../../repository/repo";

export  class GroupChatContainer extends Component{

    constructor(props) {
        super(props);
        this.state = {
            messages: null,
        }
    }

    componentDidMount() {
        getGroupChats().then(res => {
            this.setState({
                messages: res
            })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const {messages} = this.state;

        if(messages === null) return <LoadingScreen/>;
        return (
            <div className='content-container'>
                <TopNavigation />
                <div className='content-list' style={{height:'92vh'}}>
                    {messages.map(message => <Post timestamp={message.timeStamp} text={message.text} name={message.name}/>)}
                </div>
                <BottomBar />
            </div>
        );
    }
};

const BottomBar = () => (
    <div className='bottom-bar'>
        <PlusIcon />
        <input type='text' placeholder='Enter message...' className='bottom-bar-input' />
    </div>
);

const Post = ({ name, timestamp, text }) => {

    const seed = Math.round(Math.random() * 100);
    return (
        <div className={'post'}>
            <div className='avatar-wrapper'>
                <img src={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`} alt='' className='avatar' />
            </div>

            <div className='post-content'>
                <p className='post-owner'>
                    {name}
                    <small className='timestamp'>{timestamp}</small>
                </p>
                <p className='post-text'>{text}</p>
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <BsPlusCircleFill
        size='22'
        className='text-green-500 dark:shadow-lg mx-2 dark:text-primary'
    />
);