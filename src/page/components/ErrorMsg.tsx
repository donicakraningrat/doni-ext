import { useEffect } from "react";

export default function ErrorMsg({msg}:{msg:string}){
    useEffect(()=>{(document.getElementById("errorMsg") as HTMLDialogElement).showModal()},[msg]);
    return(
        <dialog id="errorMsg" className="errorMsg">
        <form method="dialog">
            <label>{msg}</label>
          <button type="submit">Ok</button>
        </form>
      </dialog>
    );
}