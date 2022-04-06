import TopNavigation from "../TopNavigation";
import {BsPlusCircleFill} from "react-icons/bs";
import {Component} from "react";
import React from 'react';
import {LoadingScreen} from "../../../common/loading";
import {getGroupChats, sendMessage} from "../../../repository/repo";
import {BiSend} from "react-icons/all";
import ScrollToBottom from 'react-scroll-to-bottom';

export class GroupChatContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: null,
            filterBy: '',
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
    }

    sendNewMessage = (message) => {
        sendMessage(message, this.props.groupID, this.props.user);
        this.setState({
            messages: [...this.state.messages, {
                name: this.props.user.name,
                text: message,
                timeStamp: new Date().toLocaleTimeString(),
                photoURL: this.props.user.photoURL,
            }]
        })
    }

    searchMessages = (searchText) => {
        this.setState({
            filterBy: searchText
        })
    }

    //searches by both name and text
    getFilteredMessages = () => {
        const {messages, filterBy} = this.state;
        if (filterBy === '') {
            return messages;
        }
        return messages.filter(message => {
            return message.name.toLowerCase().includes(filterBy.toLowerCase())
                || message.text.toLowerCase().includes(filterBy.toLowerCase())
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }


    getAvailableHeight = () => {
        return window.innerHeight - (64)+'px';
    }

    render() {
        const {messages, filterBy} = this.state;
        const {toolbarHidden, group} = this.props;
        if (messages === null) return <LoadingScreen/>;
        return (
            <div className='content-container' style={{marginLeft:toolbarHidden?'64px' : null}}>
                <TopNavigation group={group} toolbarHidden={toolbarHidden} type={'- Group Chat'} onSearch={this.searchMessages}/>
                <ScrollToBottom>
                    <div className='content-list' style={{height: this.getAvailableHeight()}}>
                        {this.getFilteredMessages().map(message => <Post
                            timestamp={message.timeStamp} text={message.text} photoURL={message.photoURL}
                            name={message.name}/>)}
                        <div style={{ float:"left", clear: "both" }}
                             ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                </ScrollToBottom>
                <BottomBar onSend={this.sendNewMessage}/>
            </div>
        );
    }
};

const BottomBar = ({onSend}) => {

    return <div className='bottom-bar'>
        {/*<PlusIcon />*/}
        <input type='text' id={'chatInput'} placeholder='Enter message...' className='bottom-bar-input'
               onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                       onSend(e.target.value);
                       e.target.value = '';
                   }
               }}/>
        <SendIcon onClick={(e) => {
            //get the value of input from chatInput and send it to onSend
            onSend(document.getElementById('chatInput').value);
            document.getElementById('chatInput').value = '';
        }}/>
    </div>
}

const Post = ({name, timestamp, text, photoURL = 'https://avatars.dicebear.com/api/open-peeps/1.svg'}) => {


    const seed = Math.round(Math.random() * 100);
    return (
        <div className={'post'}>
            <div className='avatar-wrapper'>
                <img src={photoURL} alt='' className='avatar'/>
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

const SendIcon = ({onClick}) => (
    <BiSend
        size='22'
        className='text-green-500 dark:shadow-lg mx-2 dark:text-primary'
        style={{cursor: 'pointer'}}
        onClick={onClick}
    />
);