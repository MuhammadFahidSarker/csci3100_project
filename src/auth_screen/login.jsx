import {useEffect, useState} from "react";
import {TextInput} from "../common/input/textinput";
import {Link} from "react-router-dom";
import './auth.css'
import {getUserDetails, logout, signIn} from "../repository/repo";
import {useNavigate} from "react-router-dom";

export default function LoginScreen({adminLogin = false}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(
        () => {
            getUserDetails().then(user => {
                if (user.success === true) {
                    navigate('/');
                }
            })
        }, []
    )


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
                    navigate('/');
                } else {
                    setError('Invalid email or password');
                }
            })
            .catch(error => {
                setLoading(false);
                setError(error.message);
            });

    }


    return <div className={'content-container'}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: '100%'
        }}>
            <div className={'auth-container'}>
                {
                    loading ? <div className={'loader'}/>
                        : <div>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '60px',
                                fontWeight: '200'
                            }}>{adminLogin === true ? 'Admin Log In' : 'Sign In'}</div>
                            <TextInput label={'Email'} value={email} placeHolder={'Email'} onChange={setEmail}/>
                            <TextInput hideCnt={true} label={'Password'} placeHolder={'Account Password'} value={password} onChange={setPassword}/>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <button onClick={() => executeLogin()}>Sign in</button>
                                {adminLogin === false ? <Link to={'/signup'}>Create Account</Link> : null}
                            </div>
                            <div style={{color: 'red'}}>{error}</div>
                        </div>
                }
            </div>
        </div>
    </div>
}