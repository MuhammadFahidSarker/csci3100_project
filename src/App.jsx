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
import {CreateGroup} from "./groups/create_group/create_group";
import {EditGroup} from "./groups/edit_group/edit_group";
import {AdminScreen} from "./admin/admin";
import {VerifyUser} from "./varification/not_verified";
import {ForgotPassword} from "./auth_screen/forgot_pass";
import {BannedUser} from "./banned_user/banned_user";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            
            <Router history={history}>
                <div id="meetingSDKElement" style={{height: "0px"}}/>
                <Routes>
                    <Route path={'/'} element={<Navigate to={'/groups'}/>}/>
                    <Route path={'/groups'} element={<GroupLauncher/>}/>
                    <Route path={'/search-group'} element={<GroupSearch/>}/>
                    <Route path={'/groups/:id'} element={<Home/>}/>
                    <Route path={'/groups/:id/edit'} element={<EditGroup/>}/>
                    <Route path={'/login'} element={<LoginScreen/>}/>
                    <Route path={'/signup'} element={<SignupScreen/>}/>
                    <Route path={'/profile'} element={<ProfileScreen />}/>
                    <Route path={'/create-group'} element={<CreateGroup/>}/>
                    <Route path={'/admin'} element={<AdminScreen/>}/>
                    <Route path={'/admin-login'} element={<LoginScreen adminLogin={true}/>}/>
                    <Route path={'/verify-user'} element={<VerifyUser/>}/>
                    <Route path={'/reset-password'} element={<ForgotPassword/>}/>
                    <Route path={'/banned'} element={<BannedUser/>}/>
                </Routes>
            </Router>
        );
    }

}


export default App;
