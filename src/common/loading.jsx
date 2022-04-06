import './loading.css'

export function LoadingScreen({}) {
    return <div
        style={{display: 'flex', height: window.innerHeight-64+'px', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <div className={'loader'}/>
    </div>
}