import './banned.css'
import React, {useEffect, useState} from "react";
import {getUserDetails, logout} from "../repository/repo";
import {useNavigate} from "react-router-dom";
import {LoadingScreen} from "../common/loading";
import {Navigate} from "react-router-dom";
import {BiLogOut} from "react-icons/all";

/**
 * @description This component is used to display the banned user page
 * If a user is banned, he/she is not allowed to use our services. Instead,
 * he/she is redirected to this page.
 * **/
export function BannedUser({}){

    /**
     * Variables to display the screen conditionally
     * **/
    const [loading, setLoading] = useState(true) // Loading screen
    const [user, setUser] = useState(null) // User details
    const navigate = useNavigate() // react hook to navigate to another page

    /**
     * @description This function is used to get the user details
     * if no user is logged in, he/she is redirected to the login page
     */
    useEffect(() => {
        getUserDetails().then(user => {
            if(user.success === true){
                setUser(user)
                setLoading(false)
            }else{
                setLoading(false)
                navigate('/login')
            }
        })
    }, [])

    /**
     */
    if(loading === true){
        return <LoadingScreen withTopNav={false}/>
    }

    if(user === null){
        return <Navigate to={'/login'}/>
    }


    /**
     * @description If the user is not banned, he/she is redirected to the home page
     */
    if(user.isBanned === false){
        return <Navigate to={'/'}/>
    }


    return <div className={'content-container'}>
        <div className={'center'}>
            <div className={'banned-container'}>
                <h1>You are banned</h1>
                <p>from using UNION for violating our policy!</p>
                <button onClick={()=>{
                    logout().then(res=>{
                        navigate('/login')
                    })
                }}><div className={'row'}>
                    <BiLogOut/>
                    Logout
                </div></button>
            </div>
        </div>
    </div>
}