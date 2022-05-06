import {useEffect, useState} from "react";
import {TextInput} from "../common/input/textinput";
import {Link} from "react-router-dom";
import './auth.css'
import {getUserDetails, logout, signIn, signUp} from "../repository/repo";
import {useNavigate} from "react-router-dom";
import logo from "../images/logo.png";
import {Loader} from "../common/loading_anim";


/**
 * return the signup screen
 * **/
export default function SignupScreen({}) {

    /**
     * variables to display the screen conditionally
     * **/
    const [name, setName] = useState(''); // name of the user
    const [email, setEmail] = useState(''); // email of the user
    const [password, setPassword] = useState(''); // password of the user
    const [password2, setPassword2] = useState(''); // password of the user
    const [loading, setLoading] = useState(false); // loading state
    const [error, setError] = useState(''); // error state
    const navigate = useNavigate(); // hook to navigate to other pages

    /**
     * use effect to check if the user is logged in,
     * if so, redirect to the home page
     * **/
    useEffect(
        () => {
            getUserDetails().then(user => {
                if (user.success === true) {
                    navigate('/');
                }
            })
        }, []
    )


    /**
     * signup function
     * if name, email, password and password2 are not empty,
     * and password and password2 are equal,
     * then signup the user
     * else show errors
     * **/
    function performSignUp(){
        if(name.length === 0 || email.length === 0 || password.length === 0){
            setError('Please fill all the fields');
            return;
        }

        if(password !== password2){
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        signUp(name, email, password).then(response => {
            setLoading(false);
            if(response.success === true){
                navigate('/');
            }else{
                setError(response.message);
            }
        })

    }

    /**
     * render the signup screen
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
                    loading ? <Loader />
                        : <div>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '60px',
                                fontWeight: '200'
                            }}>Sign Up</div>
                            <TextInput label={'Name'} placeHolder={'Full Name'} onChange={setName}/>
                            <TextInput label={'Email'} placeHolder={'Email'} onChange={setEmail}/>
                            <TextInput hideCnt={true} label={'Password'} placeHolder={'Account Password'} onChange={setPassword}/>
                            <TextInput hideCnt={true} label={'Re-Password'} placeHolder={'Re Type Password'}  onChange={setPassword2}/>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <button onClick={() => performSignUp()}>Sign Up</button>
                                <Link to={'/login'}>Sign in Instead</Link>
                            </div>
                            <div style={{color: 'red'}}>{error}</div>
                        </div>
                }
            </div>
        </div>
    </div>
}