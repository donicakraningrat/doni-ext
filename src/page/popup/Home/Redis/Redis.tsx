import { useState } from "react";
import TextBox from "../../../components/TextBox";
import axios from "axios";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { TConfig, TDbConfig } from "../../../const/db";
import SpinEdit from "../../../components/SpinEdit";

export default function Redis({apiEndpoint,config}:{apiEndpoint:string,config:TConfig}) {
    // const [redisFormData, setRedisFormData] = useState({ email: "", host: "", port: 6379, key: "otp:login_otp:code:" });
    const [key, setKey] = useState("");
    const [dbIndex, setDbIndex] = useState(0);
    // const [emailHist, setEmailHist] = useLocalStorage<string[]>("redis_email",[]);
    // const [hostHist, setHostHist] = useLocalStorage<string[]>("redis_host",[]);

    const [errorMsg, setErrorMsg] = useState("");
    function ShowErrorMsg(msg: string) {
        setErrorMsg(msg);
        const _errorDialog = document.getElementById("errorMsg") as HTMLDialogElement;
        _errorDialog.showModal();
    }

    function h_getReditBtn() {
            const apiUrl = `${apiEndpoint}/redis/get`;
            axios.post(apiUrl, {
                "config": {...config.redisConfig,db:dbIndex},
                "key": key
            })
                .then(function (response) {
                    (document.getElementById("redisValueTxt") as HTMLInputElement).value = JSON.stringify(response.data);
                })
                .catch(function (error) {
                    if (error.code === "ERR_NETWORK")
                        ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                    else
                        ShowErrorMsg(error.message);
                });
    }
    return (
        <>
            <dialog id="errorMsg" className="errorMsg">
                <form method="dialog">
                    <label>{errorMsg}</label><br />
                    <button type="submit">Ok</button>
                </form>
            </dialog>
            <fieldset>
                <legend>Redis OTP</legend>
                <SpinEdit id="dbIndex" label="db Index:" value={dbIndex} onChange={e=>setDbIndex(parseInt(e.target.value))} />
                {/* <TextBox id="hostTxt" label="Host:" value={redisFormData.host} history={hostHist} onChange={(e) => setRedisFormData({ ...redisFormData, ...{ host: e.target.value } })} /> */}
                <TextBox id="keyTxt" label="key:" value={key} onChange={(e) => setKey(e.target.value)} />
                {/* <TextBox id="portTxt" label="Port:" value={redisFormData.port} onChange={(e)=>setRedisFormData({...redisFormData,...{port:e.target.value}})}/> */}
                {/* <TextBox id="keyTxt" label="key:" value={redisFormData.key} onChange={(e)=>setRedisFormData({...redisFormData,...{key:e.target.value}})}/> */}
                <button id="getReditBtn" onClick={h_getReditBtn}>Get Redis Data</button>
                <textarea id="redisValueTxt" readOnly={true} />
            </fieldset>
        </>
    );
}