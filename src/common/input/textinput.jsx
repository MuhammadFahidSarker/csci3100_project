import './txtinput.css';

export function TextInput({label, value, multiline = false, onChange, placeHolder}) {
    return <div>
        <div className={'label'}>{label}</div>
        {multiline === true ?
            <textarea className={'inp-ml'} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeHolder}/> :
            <input className={'inp'} value={value} type="text" onChange={(e) => onChange?.(e.target.value)}
                   placeholder={placeHolder}/>
        }
    </div>
}