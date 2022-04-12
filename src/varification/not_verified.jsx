import {useEffect, useState} from "react";
import {LoadingScreen} from "../common/loading";
import {useNavigate} from "react-router-dom";
import {AiFillCloseCircle, FiCheckCircle, FiHome, FiLoader, FiRefreshCw, FiRepeat} from "react-icons/all";
import {getUserDetails, sendVerificationEmail} from "../repository/repo";
import {Navigate} from 'react-router-dom';

export function VerifyUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();


    useEffect(
        () => {
            getUserDetails().then(user => {
                console.log(user);
                if(user.success === true){
                    setUser(user);
                    setLoading(false);
                }
            })
        },[]
    )

    function resendUserVerifyEmail () {
        setLoading(true);
        sendVerificationEmail().then(res => {
            setLoading(false);
            if(res.success === true){
                setEmailSent(true);
            }
        })
    }

    console.log('verification screen:',user);

    if (loading === true) {
        return <LoadingScreen withTopNav={false}/>
    }


    if(user === null){
        return  <Navigate to={'/logiasdn'}/>
    }

    if (user.isVerified === true) {
        return <div className={'content-container'}>
            <div className={'center'}>
                <div className={'verify-container'}>
                    <div className={'row'} style={{fontSize:'40px'}}>
                        <FiCheckCircle/>
                        <div>You are already verified!</div>
                    </div>
                    <div className={'row'}>
                        <button onClick={() => navigate('/')}>
                            <div className={'row'}><FiHome/>Home</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    return <div className={'content-container'}>
        <div className={'center'}>
            <div className={'verify-container'}>
                <div className={'row'} style={{fontSize:'40px'}}>
                    <AiFillCloseCircle style={{color:'red'}}/>
                    <div>Your Account is not verified!</div>
                </div>
                <div style={{textAlign:'center'}}>Please check your email to verify your account!</div>
                {emailSent === false ?
                    <div className={'row'}>
                        <button onClick={() => resendUserVerifyEmail()}>
                            <div className={'row'}><FiRefreshCw/>Re-send Email</div>
                        </button>
                    </div> : <div style={{textAlign:'center'}}>Email Sent</div> }

            </div>
        </div>
    </div>

}