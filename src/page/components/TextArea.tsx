type TPropTextArea = {
    value?:string,
    onChange?:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void,
    id:string,
    label?:string,
    history?:string[],
    required?:boolean,
    style?:React.CSSProperties
}
export default function TextArea({value,onChange,id,label,required,style}:TPropTextArea) {
    return (
        <>
        {(label)? <label htmlFor={id}>{label}</label>:null}
            <textarea value={value} onChange={onChange} id={id} required={required} style={style}/>
        </>
    );
}