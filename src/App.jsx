import {Component} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate}  from 'react-router-dom'
import LoginScreen from "./auth_screen/login";
import SignupScreen from "./auth_screen/signup";
import {H1} from "next-gen-ui/lib/components/typography";
import Home from "./home_screen/home_screen";
import history from './common/history';
import GroupLauncher from "./groups/group_launcher";
import GroupSearch from "./groups/group_search";
import {ProfileScreen} from "./profile/profile";
import {user} from "./repository/firebase_auth";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router history={history}>
                <Routes>
                    <Route path={'/'} element={<Navigate to={'/group_launcher'}/>}/>
                    <Route path={'/group_launcher'} element={<GroupLauncher/>}/>
                    <Route path={'/search_group'} element={<GroupSearch/>}/>
                    <Route path={'/groups/:id'} element={<Home/>}/>
                    <Route path={'/login'} element={<LoginScreen/>}/>
                    <Route path={'/signup'} element={<SignupScreen/>}/>
                    <Route path={'/profile'} element={<ProfileScreen user={{
                        success: true,
                        isVerified: false, //whether the user being queried is verified
                        name: 'Fahid',
                        userID: 'asdasd',
                        isAdmin: false,
                        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
                    }}/>}/>
                </Routes>
            </Router>
        );
    }

}


export default App;
