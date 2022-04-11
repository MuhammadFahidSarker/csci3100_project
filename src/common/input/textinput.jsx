import './txtinput.css';

export function TextInput({label, multiline = false, onChange, placeHolder}) {
    return <div>
        <div className={'label'}>{label}</div>
        {multiline === true ?
            <textarea className={'inp-ml'} onChange={(e) => onChange?.(e.target.value)} placeholder={placeHolder}/> :
            <input className={'inp'} type="text" onChange={(e) => onChange?.(e.target.value)}
                   placeholder={placeHolder}/>
        }
    </div>
}