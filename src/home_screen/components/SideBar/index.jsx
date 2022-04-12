import {BsPlus, BsFillLightningFill, BsGearFill, BsInfo, BsSearch} from 'react-icons/bs';
import {FaFire, FaMoon, FaPoo, FaSearch, FaSun, FaUserCircle} from 'react-icons/fa';
import {AiOutlineLogout, BiGroup, BiSearch, FiLogOut, GrGroup} from "react-icons/all";
import useDarkMode from "../../hooks/useDarkMode";
import { useNavigate } from "react-router-dom";
import {logout} from "../../../repository/repo";


const SideBar = ({onClick, user, group}) => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    let navigate = useNavigate();

  return (
      // take full height of the screen
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg" >

        <SideBarIcon icon={<FaFire size="32" onClick={()=> onClick('hide_show')}/>} text={'Show Hide Toolbar'} />
        <Divider />
        <SideBarIcon text={'View/Edit Profile - '+user.name} icon={user?.photoURL === null ? <BiSearch size="32" /> : <img src={user.photoURL} className='avatar'/> } />,
        {(group === null || group === undefined)? null
        : [
                <SideBarIcon icon={<BiGroup size="32" />} text={'Groups'} onClick={()=> navigate("/groups", { replace: true })}/>,
                <SideBarIcon icon={<BsGearFill size="32" />} text={'Edit '+group.name} onClick={(_)=>navigate('/groups/'+group.groupid+'/edit')}/>,
            ]}

        <Divider />

        <SideBarIcon icon={<FiLogOut size="22" />} text={'Log Out'} onClick={(e) => {
            logout();
            navigate("/login", { replace: true })
        }}/>
    </div>
  );
};

export const SideBarIcon = ({ icon, text = 'tooltip 💡' , onClick}) => (
  <div className="sidebar-icon group"  onClick={() => onClick?.()}>
    {icon}
    <span class="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </div>
);



const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
