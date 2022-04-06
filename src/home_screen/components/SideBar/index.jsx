import {BsPlus, BsFillLightningFill, BsGearFill, BsInfo, BsSearch} from 'react-icons/bs';
import {FaFire, FaMoon, FaPoo, FaSearch, FaSun, FaUserCircle} from 'react-icons/fa';
import {AiOutlineLogout, BiGroup, BiSearch, FiLogOut, GrGroup} from "react-icons/all";
import useDarkMode from "../../hooks/useDarkMode";

const SideBar = ({onClick, user}) => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
  return (
      // take full height of the screen
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg" >

        <SideBarIcon icon={<FaFire size="32" onClick={()=> onClick('hide_show')}/>} text={'Show Hide Toolbar'} />
        <Divider />
        <SideBarIcon text={'View/Edit Profile - '+user.name} icon={user?.photoURL === null ? <BiSearch size="32" /> : <img src={user.photoURL} className='avatar'/> } />
        <SideBarIcon icon={<BiGroup size="32" />} text={'Groups'}/>
        <SideBarIcon icon={<BsGearFill size="32" />} text={'Settings'}/>
        <Divider />
        <SideBarIcon icon={darkTheme ? (
                <FaSun size={'32'} />
            ) : (
                <FaMoon size={'32'}/>
            )} onClick={handleMode} text={darkTheme ? 'Light Theme' : 'Dark Theme'}/>
        <SideBarIcon icon={<FiLogOut size="22" />} text={'Log Out'}/>
    </div>
  );
};

const SideBarIcon = ({ icon, text = 'tooltip 💡' , onClick}) => (
  <div className="sidebar-icon group"  onClick={() => onClick?.()}>
    {icon}
    <span class="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </div>
);



const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
