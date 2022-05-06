import {useEffect, useState} from "react";
import {LoadingScreen} from "../common/loading";
import {useNavigate} from "react-router-dom";
import {AiFillCloseCircle, FiCheckCircle, FiHome, FiLoader, FiLogOut, FiRefreshCw, FiRepeat} from "react-icons/all";
import {getUserDetails, logout, sendVerificationEmail} from "../repository/repo";
import {Navigate} from 'react-router-dom';

/**
 * @description This is the component that is rendered when the user is not verified
 * @returns {JSX.Element}
 * @constructor
 */
export function VerifyUser() {
    const [user, setUser] = useState(null); // user details
    const [loading, setLoading] = useState(true); // loading state
    const [emailSent, setEmailSent] = useState(false); // email sent state
    const navigate = useNavigate(); // navigate to another page

    /**
     */
    useEffect(
        () => {
            getUserDetails().then(user => {
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


    if (loading === true) {
        return <LoadingScreen withTopNav={false}/>
    }


    /**
     * User not logged in
     */
    if(user === null){
        return  <Navigate to={'/logiasdn'}/>
    }

    /**
     * User already verified
     */
    if (user.isVerified === true) {
        return <div className={'content-container'}>
            <div className={'center'}>
                <div className={'verify-container'}>
                    <div className={'row'} style={{fontSize:'40px'}}>
                        <FiCheckCircle/>
                        <div>You are already verified!</div>
                    </div>
                    <div className={'row'}>
                        <button onClick={() => {
                            logout().then(res=>{
                                if(res.success === true){
                                    navigate('/login')
                                }
                            })
                        }}>
                            <div className={'row'}><FiLogOut/>Logout</div>
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