import './loading.css'

export function LoadingScreen({}) {
    return <div
        style={{display: 'flex', height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <div className={'loader'}/>
    </div>
}