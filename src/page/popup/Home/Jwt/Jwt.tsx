import { useEffect, useState } from "react";
import "./Jwt.css"
import axios from "axios";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { TConfig, TDbConfig } from "../../../const/db";
import TextBox from "../../../components/TextBox";
const jwtAlgor = [ "HS256","HS384","HS512","RS256","RS384","RS512","PS256","PS384","PS512","ES256","ES384","ES512"]
//     { code: "HS256", label: "HMAC using SHA-256 hash algorithm" },
//     { code: "HS384", label: "HMAC using SHA-384 hash algorithm" },
//     { code: "HS512", label: "HMAC using SHA-512 hash algorithm" },
//     { code: "RS256", label: "RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm" },
//     { code: "RS384", label: "RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm" },
//     { code: "RS512", label: "RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm" },
//     { code: "PS256", label: "RSASSA-PSS using SHA-256 hash algorithm (only node ^6.12.0 OR >=8.0.0)" },
//     { code: "PS384", label: "RSASSA-PSS using SHA-384 hash algorithm (only node ^6.12.0 OR >=8.0.0)" },
//     { code: "PS512", label: "RSASSA-PSS using SHA-512 hash algorithm (only node ^6.12.0 OR >=8.0.0)" },
//     { code: "ES256", label: "ECDSA using P-256 curve and SHA-256 hash algorithm" },
//     { code: "ES384", label: "ECDSA using P-384 curve and SHA-384 hash algorithm" },
//     { code: "ES512", label: "ECDSA using P-521 curve and SHA-512 hash algorithm" },
// ]
export default function Jwt({apiEndpoint,config}:{apiEndpoint:string,config:TConfig}) {
    const [jwtFormData, setJwtFormData] = useLocalStorage<tJWT>("jwt_FormData", {});
    const [secretList, setSecretList] = useLocalStorage<string[]>("jwt_secretList", []);
    const [emailList, setEmailList] = useLocalStorage<string[]>("jwt_emailList", []);
    
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        setJwtFormData({...jwtFormData,...config.jwtConfig});
      },[config]);

    function ShowErrorMsg(msg:string){
        setErrorMsg(msg);
        const _errorDialog = document.getElementById("errorMsg") as HTMLDialogElement;
        _errorDialog.showModal();
    }

    function h_btnEmail(e: React.FormEvent<HTMLButtonElement>) {
        if(!config || !config.dbConfig.host || !config.dbConfig.user || !config.dbConfig.password) {
            alert(`Koneksi SQl tidak benar
            ${JSON.stringify(config,null,4)}`)
            return;}
        const _ddEmail = document.getElementById('Email_Txt') as HTMLInputElement;
        const SecretKey_Txt = document.getElementById('SecretKey_Txt') as HTMLInputElement;
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
                params: _ddEmail.value
            })
            .then(function (response) {
                if(response.data.length === 0) {
                    ShowErrorMsg(`${_ddEmail.value} tidak di temukan`);
                    return;
                }
                let _uid = response.data[0].id
                let _jwtFormData = { ...jwtFormData }
                if (!_jwtFormData.payload) _jwtFormData.payload = { r: "user" };
                _jwtFormData.payload.em = _ddEmail.value;
                _jwtFormData.payload.uid = _uid;
                setJwtFormData(_jwtFormData);
    
                let _emailList: string[] = [...emailList];
                if (!_emailList.find(e => { return (e === _ddEmail.value) })) {
                    _emailList.push(_ddEmail.value);
                    setEmailList(_emailList);
                }

                let _secretList: string[] = [...secretList];
                if (!_secretList.find(e => { return (e === SecretKey_Txt.value) })) {
                    _secretList.push(SecretKey_Txt.value);
                    setSecretList(_secretList);
                }
                
                _ddEmail.value = "";
            })
            .catch((error)=>{
                    if (error.code === "ERR_NETWORK")
                        ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                    else
                        ShowErrorMsg(error.message);
                });
    }
    function h_btnExpDate(e: React.FormEvent<HTMLButtonElement>) {
        const val = (document.getElementById('expDateDtp') as HTMLInputElement).value;
        const timestamp = Date.parse(val);

        let _jwtFormData = { ...jwtFormData }
        if (!_jwtFormData.payload) _jwtFormData.payload = { r: "user" };
        _jwtFormData.payload.exp = timestamp / 1000;

        setJwtFormData(_jwtFormData);
    }
    function encode(cb: (c: any) => void) {
        const apiUrl = `${apiEndpoint}/jwt/encoded`;
        axios.post(apiUrl, {
            payload: jwtFormData.payload,
            secretKey: jwtFormData.secretKey,
            alg: jwtFormData.algorithm
        })
            .then(function (response) {
                cb(response.data.token);
            })
            .catch(function (error) {
                if (error.code === "ERR_NETWORK")
                    ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                else
                    ShowErrorMsg(error.message);
            });

    }
    function h_btnEncode_click() {
        encode(t => setJwtFormData({ ...jwtFormData, ...{ token: t } }));
    }
    function h_btnDecode_click() {
        const apiUrl = `${apiEndpoint}/jwt/decoded`; // Replace with your API URL
        axios.post(apiUrl, {
            token: jwtFormData.token,
            secretKey: jwtFormData.secretKey
        })
            .then(function (response) {
                if (response.data) setJwtFormData({ ...jwtFormData, ...{ payload: response.data } });
            })
            .catch(function (error) {
                if (error.code === "ERR_NETWORK")
                    ShowErrorMsg(`Error: Kemungkinan API belum diaktifkan.`);
                else
                    ShowErrorMsg(error.message);
            });
    }
    function h_btnCookies_click() {
        encode(async (t) => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab.id) {
                const response = await chrome.tabs.sendMessage(tab.id, { token: t });
                setJwtFormData({ ...jwtFormData, ...{ token: t } });
            }
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
            <fieldset id="groupEncode">
                <legend>Encoder</legend>
                <TextBox id="SecretKey_Txt" label="Secret Key " value={jwtFormData.secretKey} history={secretList} onChange={(e) => setJwtFormData({ ...jwtFormData, ...{ secretKey: e.target.value } })} className="col1"/>
                <TextBox id="Algoritma_Txt" label="Algoritma " value={jwtFormData.algorithm} history={jwtAlgor} onChange={e => setJwtFormData({ ...jwtFormData, ...{ algorithm: e.target.value } })} style={{ width: "75px" }} className="col2"/>
                <TextBox id="Email_Txt" label="Email :" history={emailList} className="col1"/>
                <button id="btnEmail" onClick={e => h_btnEmail(e)} className="col2">Set Email</button>
                <label htmlFor="expDateDtp" className="col1">Exp. date</label>
                <input id="expDateDtp" type="datetime-local" className="col1"/>
                <button id="btnExpDate" onClick={e => h_btnExpDate(e)} className="col2">Set Exp Date</button>
                <label htmlFor="txtPayload" className="col1">Payload :</label>
                <textarea id="txtPayload" value={JSON.stringify(jwtFormData.payload)} onChange={e => setJwtFormData({ ...jwtFormData, ...{ payload: JSON.parse(e.target.value) } })} className="col0" />
                <button onClick={h_btnEncode_click}>Encode</button>
                <button onClick={h_btnCookies_click}>Inject to Cookies</button>
            </fieldset>
            <fieldset id="groupDecode">
                <legend>Decoder</legend>
                <label htmlFor="txtToken">Token : <button onClick={h_btnDecode_click}>Decode</button>
                </label>
                <textarea id="txtToken" rows={5} value={jwtFormData.token} onChange={e => setJwtFormData({ ...jwtFormData, ...{ token: e.target.value } })} />
            </fieldset>
        </>
    );
}

type tJWT =
{
    secretKey: string;
    algorithm: string;
    expiredDate?: string;
    payload?: tJwtPayload;
    token?: string;
}
type tJwtPayload ={
    em?: string;
    exp?: number;
    r?: string;
    uid?: number;
}