import {useEffect, useState} from "react";
import {TextInput} from "../common/input/textinput";
import {Link} from "react-router-dom";
import './auth.css'
import {getUserDetails, logout, signIn, signUp} from "../repository/repo";
import {useNavigate} from "react-router-dom";
import logo from "../images/logo.png";
import {Loader} from "../common/loading_anim";

export default function SignupScreen({}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
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