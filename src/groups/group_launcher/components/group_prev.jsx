import './group_prev.css'
import {Button} from "next-gen-ui";
import useDarkMode from "../../../home_screen/hooks/useDarkMode";
import { useNavigate } from "react-router-dom";

export default function GroupPreview({group}) {
    let navigate = useNavigate();

    return <div className={'prev'} style={{
        display: 'flex', fontSize: '40px',
        margin: '5px', marginLeft:'80px', marginRight:'80px',
        padding:'30px',
        justifyContent: 'space-between', alignItems: 'center',
        border:'3px solid #fc9803',
        borderRadius: '10px', width:'80%'
    }}><div>
        {group.name}
        <div style={{fontSize:'20px'}}>
            {group.description}
        </div>
    </div>
        <button style={{
            margin:'10px',
            padding:'10px',
            border:'2px solid #fc8403',
            backgroundColor:'#fc9803',
            borderRadius:'10px'
        }} onClick={(e) => navigate('/groups/'+group.id)}>Launch</button></div>
}