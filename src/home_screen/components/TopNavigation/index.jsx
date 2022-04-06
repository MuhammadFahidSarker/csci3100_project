import {
    FaSearch, FaHashtag, FaRegBell, FaUserCircle, FaMoon, FaSun,
} from 'react-icons/fa';
import useDarkMode from '../../hooks/useDarkMode';
import {GoLinkExternal} from "react-icons/all";

const TopNavigation = ({toolbarHidden, url = null, onSearch=null, type=''}) => {
    return (<div className='top-navigation'>
        <HashtagIcon toolbarHidden={toolbarHidden}/>
        <Title type={type}/>
        {url === null ? null : <Expand url={url}/>}
        {onSearch === null ? null : <Search onSearch={onSearch}/>}
        <BellIcon/>
    </div>);
};


const Search = ({onSearch}) => (<div className='search'>
    <input className='search-input' type='text' placeholder='Search...' onChange={(e) => onSearch(e.target.value)}/>
    <FaSearch size='18' className='text-secondary my-auto'/>
</div>);
const BellIcon = () => <FaRegBell size='24' className='top-navigation-icon'/>;
const HashtagIcon = ({toolbarHidden}) => <FaHashtag size='20' className='title-hashtag'
                                                    style={{}}/>;
const Title = ({type}) => <h5 className='title-text'>{'UNION'+type}</h5>;
const Expand = ({url}) => <GoLinkExternal size='24' className='top-navigation-icon' onClick={(e) => {
    e.preventDefault();
    window.open(url, '_blank');
}}/>
export default TopNavigation;
