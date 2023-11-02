type TPropSpinEdit = {
    value:number|"",
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    id:string,
    label?:string
}
export default function SpinEdit({value,onChange,id,label}:TPropSpinEdit) {
    return (
        <>
        {(label)?<label htmlFor={id}>{label}</label>:null}
            <input value={value} onChange={onChange} id={id} type="number"/>
        </>
        
    );
}