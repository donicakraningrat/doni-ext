type TPropTextBox = {
    value?:string,
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    id:string,
    label?:string,
    history?:string[],
    required?:boolean,
    style?:React.CSSProperties,
    readOnly?:boolean
}
export default function TextBox({value,onChange,id,label,history,required,style,readOnly}:TPropTextBox) {
    return (
        <>
        {(label)?<label htmlFor={id}>{label}</label>:null}
            <input value={value} onChange={onChange} id={id} type="text" list={`${id}_list`} required={required} style={style} readOnly={readOnly}/>
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