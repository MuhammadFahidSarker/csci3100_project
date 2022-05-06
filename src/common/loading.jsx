import './loading.css'
import useDarkMode from "../home_screen/hooks/useDarkMode";
import {Loader} from "./loading_anim";

/**
 * @description A Loading Screen component that shows a loading
 * **/
export function LoadingScreen({withTopNav = true}) {
    return <div className={'content-container'}
                style={{
                    display: 'flex',
                    height: withTopNav === true ? window.innerHeight - 64 + 'px' : window.innerHeight + 'px',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
        <Loader />
    </div>
}