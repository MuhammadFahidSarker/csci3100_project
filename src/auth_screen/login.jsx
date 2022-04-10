import {Component} from 'react';
import {Login} from 'next-gen-ui'
import './auth.css'
import {signIn} from "../repository/repo";
import {Navigate} from "react-router-dom";

class LoginScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loginSuccess:null,
        }
    }

    handleSignIn = async ({email, password}) => {
        this.setState({loading: true});
        const res = await signIn(email, password);
        if(!res.success){
            // TODO: pop error to user
            console.log(res.error)            
        }
        this.setState({loginSuccess: res.success === true, loading: false});
    }

    render() {
        const {loading, loginSuccess} = this.state;

        //if(loading) return <div>Loading...</div>

        if(loginSuccess) {
            return <Navigate to={'/'}/>
        }

        return (
            <div>
                <div style={{fontSize:'80px', textAlign:'center', width:'100%',}}>Union</div>
                <div className={'auth'}>
                    <Login registerLink={'/signup'} onSubmit={this.handleSignIn} loading={loading} />
                </div>
            </div>
        );
    }
}

export default LoginScreen;