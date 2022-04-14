import loading from '../images/loading.gif'

export function Loader({height='120px', width='120px'}){
    return <img src={loading} alt="loading" style={{height, width, borderRadius:'50%'}}/>
}