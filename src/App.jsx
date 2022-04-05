import {Component} from "react";
import {BrowserRouter as Router, Route, Routes}  from 'react-router-dom'
import LoginScreen from "./auth_screen/login";
import SignupScreen from "./auth_screen/signup";
import {H1} from "next-gen-ui/lib/components/typography";
import Home from "./home_screen/home_screen";
import history from './common/history';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router history={history}>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/login'} element={<LoginScreen/>}/>
                    <Route path={'/signup'} element={<SignupScreen/>}/>
                </Routes>
            </Router>
        );
    }

}


export default App;
