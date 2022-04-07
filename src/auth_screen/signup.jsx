import {Component} from 'react';
import {Login, Signup} from 'next-gen-ui'
import './auth.css'
import {signIn, signUp} from "../repository/repo";
import {Navigate} from "react-router-dom";

export  default class SignupScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loginSuccess:null,
        }
    }

    handleSignUp = async ({email, password}) => {
        this.setState({loading: true});
        const res = await signUp(email, password);
        
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
                    <Signup registerLink={'/login'} onSubmit={this.handleSignUp} loading={loading} />
                </div>
            </div>
        );
    }
}