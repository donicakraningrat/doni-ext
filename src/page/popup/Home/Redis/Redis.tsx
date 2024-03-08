import { useEffect, useState } from "react";
import TextBox from "../../../components/TextBox";
import axios from "axios";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { TConfig, TDbConfig } from "../../../const/db";
import SpinEdit from "../../../components/SpinEdit";
import "./Redis.css"

type redistForm = {
    name:string,
    env:string,
    key:string,
    dbIndex:number,
}
export default function Redis({apiEndpoint,config}:{apiEndpoint:string,config:TConfig}) {
    // const [redisFormData, setRedisFormData] = useState({ email: "", host: "", port: 6379, key: "otp:login_otp:code:" });
    const [redisName, setRedisName] = useState("");
    const [key, setKey] = useState("");
    const [dbIndex, setDbIndex] = useState(0);
    const [redisKeyList, setRedisKeyList] = useLocalStorage<redistForm[]>("redis_keys",[]);

    const [errorMsg, setErrorMsg] = useState("");
    function ShowErrorMsg(msg: string) {
        setErrorMsg(msg);
        const _errorDialog = document.getElementById("errorMsg") as HTMLDialogElement;
        _errorDialog.showModal();
    }
    useEffect(()=>{
        let selectedKey = redisKeyList.find(kl=>kl.name === redisName);
        if(selectedKey){
        setKey(selectedKey.key);
        setDbIndex(selectedKey.dbIndex);
    }
    },[redisName])
    // function h_selectReditKey(e:React.ChangeEvent<HTMLInputElement>){
    //     setRedisName(e.target.value);
    // }
    function h_getReditBtn() {
            const apiUrl = `${apiEndpoint}/redis/get`;
            axios.post(apiUrl, {
                "config": {...config.redisConfig,db:dbIndex},
                "key": key
            })
                .then(function (response) {
                    if(response.data.error) (document.getElementById("redisValueTxt") as HTMLInputElement).value = response.data.error;
                    else (document.getElementById("redisValueTxt") as HTMLInputElement).value = response.data.value;
                })
                .catch(function (error) {
                    if (error.code === "ERR_NETWORK")
                        ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                    else
                        ShowErrorMsg(error.message);
                });
    }
    
    function h_deleteRedisBtn() {
            const apiUrl = `${apiEndpoint}/redis/delete`;
            axios.post(apiUrl, {
                "config": {...config.redisConfig,db:dbIndex},
                "key": key
            })
                .then(function (response) {
                    if(response.data.error) (document.getElementById("redisValueTxt") as HTMLInputElement).value = response.data.error;
                    else (document.getElementById("redisValueTxt") as HTMLInputElement).value = response.data.value;
                })
                .catch(function (error) {
                    if (error.code === "ERR_NETWORK")
                        ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                    else
                        ShowErrorMsg(error.message);
                });
    }
    function h_getRedisKeyBtn() {
            const apiUrl = `${apiEndpoint}/redis/keys`;
            axios.post(apiUrl, {
                "config": {...config.redisConfig,db:dbIndex},
                "key": key
            })
                .then(function (response) {
                    if(response.data.error) (document.getElementById("redisValueTxt") as HTMLInputElement).value = response.data.error;
                    else (document.getElementById("redisValueTxt") as HTMLInputElement).value = response.data.value;
                })
                .catch(function (error) {
                    if (error.code === "ERR_NETWORK")
                        ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                    else
                        ShowErrorMsg(error.message);
                });
    }
    function h_saveRedistKey(){
        //otp:login_otp:v2:code:
        setRedisKeyList(prev=>{
            if(prev.findIndex(v=>(v.env === config.name && v.key === key && v.dbIndex === dbIndex)) === -1){
                
                return [...prev,{env:config.name,key:key,dbIndex:dbIndex,name:redisName}];
            }
            return prev;
        })
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
                <TextBox id="redisName" label="Pilih Redis Key:" value={redisName} onChange={(e) => setRedisName(e.target.value)} history={redisKeyList.map(k=>k.name)}/>
                <SpinEdit id="dbIndex" label="db Index:" value={dbIndex} onChange={e=>setDbIndex(parseInt(e.target.value))}/>
                <br />
                <div id="divKeyTxt">
                <TextBox id="keyTxt" label="key:" value={key} onChange={(e) => setKey(e.target.value)} history={redisKeyList.map(k=>k.key)}/>
                </div>
                <button id="getReditBtn" onClick={h_getReditBtn}>Get Redis Data</button>
                <button id="getKeysRedisBtn" onClick={h_getRedisKeyBtn}>Get Keys</button>
                <button id="deleteKeysRedisBtn" onClick={h_deleteRedisBtn}>Delete</button>
                <textarea id="redisValueTxt" readOnly={true} rows={5} style={{overflowY:"scroll"}}/>
                <br/>
                <button id="addRedisKey" onClick={h_saveRedistKey}>Save</button>
            </fieldset>
        </>
    );
}