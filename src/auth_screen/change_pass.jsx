
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {LoadingScreen} from "../common/loading";
import {getUserDetails, updateUserPassword} from "../repository/repo";
import {useNavigate} from "react-router-dom";
import logo from "../images/logo.png";
import {TextInput} from "../common/input/textinput";
import {Loader} from "../common/loading_anim";

/**
 * Change password screen
 * **/

export function ChangePassword(){
    const path = useLocation().pathname; // get current path
    const targetUserID = path.split("/")[3]; // get user id from path
    const [password, setPassword] = useState(""); // password
    const [password2, setPassword2] = useState(""); // password2
    const [loading, setLoading] = useState(true); // loading
    const [error, setError] = useState(''); // error
    const [success, setSuccess] = useState(''); // success
    const navigate = useNavigate(); // navigate for navigating the screen

    /**
     * get user details
     * only admin can access this page --> if user is not admin, redirect to admin-login
     * **/
    useEffect(
        () => {
            getUserDetails().then((res) => {
                if(res.success === true){
                    if(res.isAdmin === false){
                        navigate("/admin-login");
                    }else{
                        setLoading(false);
                    }
                }else{
                    navigate("/admin-login");
                }
            })
        },[]
    )

    /**
     * update user password
     * if password and password2 are same and not empty, update the password
     * else show error
     * **/
    async  function changePass(){
        if(password === '' || password2 === '') {
            setError("Please enter password");
            return;
        }
        if(password !== password2) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        const res = await updateUserPassword(targetUserID, password);
        console.log(res);
        if(res.success === true){
            setSuccess("Password changed successfully!");
        }else {
            setError('Unknown Error Occurred!');
        }
        setLoading(false);
    }


    /**
     * return ui
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
                {loading ? null : <div className={'center'}> <img className={'logo'} src={logo}/>
                </div>}
                {
                    success === '' ?
                        loading ? <Loader />
                            : <div>
                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '60px',
                                    fontWeight: '200'
                                }}>Reset Password</div>
                            <div>User ID: {targetUserID}</div>
                                <TextInput label={'New Password'} hideCnt={true} placeHolder={'New Password'} onChange={setPassword}/>
                                <TextInput label={'Re Password'} hideCnt={true} placeHolder={'Re Password'} onChange={setPassword2}/>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <button onClick={() => changePass()}>Reset</button>
                                    <button onClick={() => navigate('/admin')}>Back to Admin Panel</button>
                                </div>
                                <div style={{color: 'red'}}>{error}</div>
                            </div>
                        : <div className={'center'}>
                            <div>
                                <div className={'success-label'}>{success}</div>
                                <button onClick={() => navigate('/admin')}>Back to Admin Panel</button>
                            </div>
                        </div>
                }
            </div>
        </div>
    </div>
}