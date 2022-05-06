import {useEffect, useState} from "react";
import {TextInput} from "../common/input/textinput";
import {Link} from "react-router-dom";
import './auth.css'
import {getUserDetails, logout, signIn} from "../repository/repo";
import {useNavigate} from "react-router-dom";

import logo from '../images/logo.png';
import {Loader} from "../common/loading_anim";


/**
 * @param adminLogin
 * @returns {*}
 * **/
export default function LoginScreen({adminLogin = false}) {

    /**
     * variables to display the screen conditionally
     * **/
    const [email, setEmail] = useState(''); // email
    const [password, setPassword] = useState(''); // password
    const [loading, setLoading] = useState(true); // loading
    const [error, setError] = useState(''); // error
    const navigate = useNavigate(); // navigate to navigate to the next screen

    /**
     * useEffect to get the user details
     * if the user is already logged in and not an admin, show error
     * **/
    useEffect(
        () => {
            getUserDetails().then(user => {
                if (user.success === true) {
                    if (user.isAdmin === false && adminLogin === true) {
                        logout().then(() => {
                                setLoading(false);
                                setError('You are not an admin');
                                return;
                            }
                        )
                    } else if (adminLogin === true) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }

                }

                setLoading(false);

            })
        }, []
    )


    /**
     * function to handle the login
     * if email and password are empty, show error
     * if email and password are not empty, sign in
     * **/
    function executeLogin() {
        if (email === '' || password === '') {
            setError('Please enter email and password');
            return;
        }
        setLoading(true);
        setError('');
        signIn(email, password, adminLogin)
            .then((res) => {
                setLoading(false);
                if (res.success) {
                    if (adminLogin === true && res.isAdmin === false) {
                        setError('Not an admin account!');
                        logout();
                    }

                    if (adminLogin === true)
                        navigate('/admin');
                    else navigate('/');
                } else {
                    setError('Invalid email or password');
                }
            })
            .catch(error => {
                setLoading(false);
                setError(error.message);
            });

    }


    /**
     * show the login screen
     * **/
    return <div className={'content-container'}>

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: '100%'
        }}>
            <div className={'auth-container'}>
                {loading ? null : <div className={'center'}><img className={'logo'} src={logo}/>
                </div>}
                {
                    loading ? <Loader/>
                        : <div>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '60px',
                                fontWeight: '200'
                            }}>{adminLogin === true ? 'Admin Log In' : 'Sign In'}</div>
                            <TextInput label={'Email'} value={email} placeHolder={'Email'} onChange={setEmail}/>
                            <TextInput hideCnt={true} label={'Password'} placeHolder={'Account Password'} value={password}
                                       onChange={setPassword}/>
                            <div style={{
                                display: 'flex',
                                margin: '20px',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <button onClick={() => executeLogin()}>Sign in</button>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <Link to={'/reset-password'}>Forgot Password?</Link>
                                    {adminLogin === false ? <Link to={'/signup'}>Create Account</Link> : null}
                                    {adminLogin === false ? <Link to={'/admin-login'}>Admin Login</Link> : null}
                                </div>
                            </div>
                            <div style={{color: 'red'}}>{error}</div>
                        </div>
                }
            </div>
        </div>
    </div>
}