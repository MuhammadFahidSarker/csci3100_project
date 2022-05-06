import './auth.css'
import {useEffect, useState} from "react";
import {TextInput} from "../common/input/textinput";
import {Link} from "react-router-dom";
import {getUserDetails, resetPasswordEmail} from "../repository/repo";
import logo from "../images/logo.png";
import {useNavigate} from "react-router-dom";
import {Loader} from "../common/loading_anim";

/**
 * return the ui of the forgot password screen
 * **/
export  function ForgotPassword(){
    /**
     * Variables to hold the state of the form and display content conditionally
     *
     * email is empty initially
     * loading is true initially
     * user is null initially
     * **/
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    /**
     * useEffect hook to fetch the user details
     * if the user is logged in, redirect to home page
     * **/
    useEffect(
        () => {
            getUserDetails().then(
                (user) => {
                    if(user.success){
                        navigate('/')
                    }else{
                        setLoading(false)
                    }
                }
            )
        },
        [user]
    )

    /**
     * if email is empty or invalid, display error message
     * if email is valid, reset password
     * **/
    async function resetPass() {
        if (email === '') {
            setError('Email is required')
            return
        }
        if (!email.includes('@')) {
            setError('Email is not valid')
            return
        }

        setLoading(true)
        const res = await resetPasswordEmail(email);
        if(res.success === true){
            setError('')
            setSuccess('Success! Check your email to reset your password')
            setLoading(false)
        }else{
            setError('Could not find the requested account. Please check your email!')
            setLoading(false)
        }
    }

    /**
     * returns the ui
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
                    success === '' ?
                    loading ? <Loader/>
                        : <div>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '60px',
                                fontWeight: '200'
                            }}>Reset Password</div>
                            <TextInput label={'Email'} value={email} placeHolder={'Email'} onChange={setEmail}/>

                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <button onClick={() => resetPass()}>Reset</button>
                                <Link to={'/login'}>Sign in</Link>
                            </div>
                            <div style={{color: 'red'}}>{error}</div>
                        </div>
                        : <div className={'center'}>
                            <div>
                                <div className={'success-label'}>{success}</div>
                                <button onClick={() => navigate('/login')}>Sign In</button>
                            </div>
                        </div>
                }
            </div>
        </div>
    </div>
}