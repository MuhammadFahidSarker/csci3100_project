import {
    FaSearch, FaHashtag, FaRegBell, FaUserCircle, FaMoon, FaSun, FaFire,
} from 'react-icons/fa';
import useDarkMode from '../../hooks/useDarkMode';
import {
    BiGroup,
    BiSearch,
    FiLogOut,
    FiPlusCircle,
    FiUser,
    GoLinkExternal,
    RiAdminFill,
    RiUser2Fill
} from "react-icons/all";
import {useNavigate} from 'react-router-dom';
import {SideBarIcon} from "../SideBar";
import {logout} from "../../../repository/repo";

const TopNavigation = ({
                           showNormalModeIcon = false,
    hideAdminIcon = false, forceName,
                           toolbarHidden,
                           user = null,
                           showAllGroup = false,
                           showCreateGroup = false,
                           group,
                           url = null,
                           onSearch = null,
                           type = ''
                       }) => {
    console.log(user)
    return (<div className='top-navigation'>
        {showNormalModeIcon ? <NormalUserIcon/> : null}
        {(hideAdminIcon === false && (user !== null  && user.isAdmin === true)) ?  <AdminIcon/> : null}
        <HashtagIcon toolbarHidden={toolbarHidden}/>
        <Title groupName={forceName ? forceName : group?.name} type={type}/>
        {onSearch === null ? null : <Search onSearch={onSearch}/>}
        {showCreateGroup === true ? <CreateGroupIcon group={group}/> : null}
        {showAllGroup === true ? <AllGroups/> : null}
        <ThemeIcon/>
        {url === null ? null : <Expand url={url}/>}
        {(user === null || user === undefined) ? null
            : [<UserIcon user={user}/>, <LogoutIcon/>]}


    </div>);
};

const NormalUserIcon =() =>{
    const navigate = useNavigate();

    return <RiUser2Fill  size={'24px'} className={'admin-icon'} onClick={(_) => {
        navigate('/groups');
    }} />
}


const AdminIcon =() =>{
    const navigate = useNavigate();

    return <RiAdminFill  size={'24px'} className={'admin-icon'} onClick={(_) => {
        navigate('/admin');
    }} />
}

const UserIcon = ({user}) => {
    const navigate = useNavigate();
    return <div onClick={() => navigate('/profile')}>
        <img  src={user.photoURL} className='avatar'/>
    </div>
}

const LogoutIcon = ({user}) => {
    const navigate = useNavigate();
    return <div >
        <FiLogOut onClick={() => {
            logout().then(
                () => {
                    navigate('/login')
                }
            )
        }} size={'24px'} className={'top-navigation-icon'}/>
    </div>
}

const CreateGroupIcon = ({}) => {
    const navigate = useNavigate();
    return <FiPlusCircle size={'24px'} className={'top-navigation-icon'} onClick={(_) => {
        navigate('/create-group');
    }}/>
}

const AllGroups = ({}) => {
    const navigate = useNavigate();
    return <BiGroup size={'24px'} className={'top-navigation-icon'} onClick={(_) => {
        navigate('/groups');
    }}/>
}

const ThemeIcon = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
        <span onClick={handleMode}>
      {darkTheme ? (
          <FaSun size='24' className='top-navigation-icon'/>
      ) : (
          <FaMoon size='24' className='top-navigation-icon'/>
      )}
    </span>
    );
};
const Search = ({onSearch}) => (<div className='search'>
    <input className='search-input' type='text' placeholder='Search...' onChange={(e) => onSearch(e.target.value)}/>
    <FaSearch size='18' className='text-secondary my-auto'/>
</div>);
const BellIcon = () => <FaRegBell size='24' className='top-navigation-icon'/>;
const HashtagIcon = ({toolbarHidden}) => <FaHashtag size='20' className='title-hashtag'
                                                    style={{}}/>;
const Title = ({groupName, type}) => <h5 className='title-text'>{(groupName ?? 'UNION') + ' ' + type}</h5>;
const Expand = ({url}) => <GoLinkExternal size='24' className='top-navigation-icon' onClick={(e) => {
    e.preventDefault();
    window.open(url, '_blank');
}}/>
export default TopNavigation;
