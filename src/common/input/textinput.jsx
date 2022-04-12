import './txtinput.css';

export function TextInput({hideCnt, label, value, multiline = false, onChange, placeHolder}) {
    return <div>
        <div className={'label'}>{label}</div>
        {multiline === true ?
            <textarea className={'inp-ml'} defaultValue={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeHolder}/> :
            <input className={'inp'}  defaultValue={value} type={hideCnt === true ? 'password' : 'text'} onChange={(e) => onChange?.(e.target.value)}
                   placeholder={placeHolder}/>
        }
    </div>
}