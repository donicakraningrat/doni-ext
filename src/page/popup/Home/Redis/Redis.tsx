import { useState } from "react";
import TextBox from "../../../components/TextBox";
import axios from "axios";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { TConfig, TDbConfig } from "../../../const/db";

export default function Redis({apiEndpoint,config}:{apiEndpoint:string,config:TConfig}) {
    const [redisFormData, setRedisFormData] = useState({ email: "", host: "", port: 6379, key: "otp:login_otp:code:" });
    const [emailHist, setEmailHist] = useLocalStorage<string[]>("redis_email",[]);
    const [hostHist, setHostHist] = useLocalStorage<string[]>("redis_host",[]);

    const [errorMsg, setErrorMsg] = useState("");
    function ShowErrorMsg(msg: string) {
        setErrorMsg(msg);
        const _errorDialog = document.getElementById("errorMsg") as HTMLDialogElement;
        _errorDialog.showModal();
    }

    function getUserID(email: string, cb: (val: any) => void) {
        const apiUrl = `${apiEndpoint}/mysql/query`; // Replace with your API URL
        axios.post(apiUrl, {
            dbConfig: {
                host: config.dbConfig.host,
                user: config.dbConfig.user,
                password: config.dbConfig.password,
                port: config.dbConfig.port,
                connectTimeout: config.dbConfig.connectTimeout,
            },
            type: "q",
            query: "select * from users.users where email = ? ",
            params: email
        })
            .then(function (response) {
                let _emailList: string[] = [...emailHist];
    
                if (!_emailList.find(e => { return (e === email) })) {
                    _emailList.push(email);
                    setEmailHist(_emailList);
                }
                cb(response.data[0].id);
            })
            .catch((error) => {
                if (error.code === "ERR_NETWORK")
                    ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                else
                    ShowErrorMsg(error.message);
            });
    }
    function h_getReditBtn() {
        getUserID(redisFormData.email, (uid) => {
            console.log(`otp:login_otp:code:${uid}`);
            const apiUrl = `${apiEndpoint}/redis/get`;
            axios.post(apiUrl, {
                "host": redisFormData.host,
                "port": redisFormData.port,
                "key": `otp:login_otp:code:${uid}`
            })
                .then(function (response) {
                    let _hostHist: string[] = [...hostHist];
        
                    if (!_hostHist.find(e => { return (e === redisFormData.host) })) {
                        _hostHist.push(redisFormData.host);
                        setHostHist(_hostHist);
                    }
                    (document.getElementById("redisValueTxt") as HTMLInputElement).value = JSON.stringify(response.data);
                })
                .catch(function (error) {
                    if (error.code === "ERR_NETWORK")
                        ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                    else
                        ShowErrorMsg(error.message);
                });
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
                <TextBox id="hostTxt" label="Host:" value={redisFormData.host} history={hostHist} onChange={(e) => setRedisFormData({ ...redisFormData, ...{ host: e.target.value } })} />
                <TextBox id="emailTxt" label="Email:" value={redisFormData.email} history={emailHist} onChange={(e) => setRedisFormData({ ...redisFormData, ...{ email: e.target.value } })} />
                {/* <TextBox id="portTxt" label="Port:" value={redisFormData.port} onChange={(e)=>setRedisFormData({...redisFormData,...{port:e.target.value}})}/> */}
                {/* <TextBox id="keyTxt" label="key:" value={redisFormData.key} onChange={(e)=>setRedisFormData({...redisFormData,...{key:e.target.value}})}/> */}
                <button id="getReditBtn" onClick={h_getReditBtn}>Get Redis Data</button>
                <textarea id="redisValueTxt" readOnly={true} />
            </fieldset>
        </>
    );
}