import TopNavigation from "../TopNavigation";
import {BsPlusCircleFill} from "react-icons/bs";

export  const GroupChatContainer = () => {
    return (
        <div className='content-container'>
            <TopNavigation />
            <div className='content-list'>
                <Post
                    name='Ada'
                    timestamp='one week ago'
                    text={`Thanks. Lets have a meeting tommorow?`}
                />
                <Post name='Leon' timestamp='one week ago' text={`Sure! I am in. Lets use the meeting scheduler`} />
                <Post name='Jill' timestamp='5 days ago' text={`Okay. Let me create a zoom meeting`} />
                <Post
                    name='Ellie'
                    timestamp='4 days ago'
                    text={`Thanks guys!`}
                />
                <Post
                    name='Jill'
                    timestamp='4 days ago'
                    text={`No worries! Thanks to union, we can easily collaborate.`}
                />
                <Post
                    name='Claire'
                    timestamp='2 days ago'
                    text={`By the way guys, did you see the new Spider-man No way home? How about a break after our projects?`}
                />
                <Post
                    name='Albert'
                    timestamp='22 hours ago'
                    text={`Yes please ☺️ `}
                />

            </div>
            <BottomBar />
        </div>
    );
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