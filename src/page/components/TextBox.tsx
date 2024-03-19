type TPropTextBox = {
    value?:string,
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    id:string,
    label?:string,
    history?:string[],
    required?:boolean,
    style?:React.CSSProperties,
    readOnly?:boolean,
    className?:string
}
export default function TextBox({value,onChange,id,label,history,required,style,readOnly,className}:TPropTextBox) {
    return (
        <>
        {(label)?<label htmlFor={id} className={className}>{label}</label>:null}
            <input value={value} onChange={onChange} id={id} type="text" list={`${id}_list`} required={required} style={style} readOnly={readOnly} className={className}/>
            {(history)?
            <datalist id={`${id}_list`} >
                {history.map((item: string) => (
                    <option key={`${id}_list_${item}`} value={item}></option>
                ))}
            </datalist>:null
            }
        </>
        
    );
}