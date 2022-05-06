import './txtinput.css';

/**
 * @description A Generic Text input component for the application
 * @param {Object} props
 * @returns {JSX}
 * **/
export function TextInput({hideCnt, width = '400px', label, value, multiline = false, onChange, placeHolder}) {
    return <div>
        <div className={'label'}>{label}</div>
        {multiline === true ?
            <textarea  className={'inp-ml'} style={{width:width}} defaultValue={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeHolder}/> :
            <input className={'inp'} style={{width:width}} defaultValue={value} type={hideCnt === true ? 'password' : 'text'} onChange={(e) => onChange?.(e.target.value)}
                   placeholder={placeHolder}/>
        }
    </div>
}