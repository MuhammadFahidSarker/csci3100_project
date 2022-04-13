import './banned.css'
import React, {useEffect, useState} from "react";
import {getUserDetails, logout} from "../repository/repo";
import {useNavigate} from "react-router-dom";
import {LoadingScreen} from "../common/loading";
import {Navigate} from "react-router-dom";
import {BiLogOut} from "react-icons/all";

export function BannedUser({}){

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

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

    if(loading === true){
        return <LoadingScreen withTopNav={false}/>
    }

    if(user === null){
        return <Navigate to={'/login'}/>
    }

    console.log(user)

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