import './auth.css'
import {useEffect, useState} from "react";
import {TextInput} from "../common/input/textinput";
import {Link} from "react-router-dom";
import {getUserDetails, resetPasswordEmail} from "../repository/repo";
import logo from "../images/logo.png";
import {useNavigate} from "react-router-dom";

export  function ForgotPassword(){
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

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
                    loading ? <div className={'loader'}/>
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