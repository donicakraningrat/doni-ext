import { useDeferredValue, useEffect, useState } from "react";
import "./Jwt.css"
import axios, { AxiosRequestConfig } from "axios";
import useLocalStorage from "../../hooks/useLocalStorage";
const jwtAlgor = [
    { code: "HS256", label: "HMAC using SHA-256 hash algorithm" },
    { code: "HS384", label: "HMAC using SHA-384 hash algorithm" },
    { code: "HS512", label: "HMAC using SHA-512 hash algorithm" },
    { code: "RS256", label: "RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm" },
    { code: "RS384", label: "RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm" },
    { code: "RS512", label: "RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm" },
    { code: "PS256", label: "RSASSA-PSS using SHA-256 hash algorithm (only node ^6.12.0 OR >=8.0.0)" },
    { code: "PS384", label: "RSASSA-PSS using SHA-384 hash algorithm (only node ^6.12.0 OR >=8.0.0)" },
    { code: "PS512", label: "RSASSA-PSS using SHA-512 hash algorithm (only node ^6.12.0 OR >=8.0.0)" },
    { code: "ES256", label: "ECDSA using P-256 curve and SHA-256 hash algorithm" },
    { code: "ES384", label: "ECDSA using P-384 curve and SHA-384 hash algorithm" },
    { code: "ES512", label: "ECDSA using P-521 curve and SHA-512 hash algorithm" },
]
type TPayload = {
    em: string;
    exp: number;
    uid: number;
}
type TJwtFormData = {
    secretKey: string;
    algorithm: string;
    payload: TPayload;
    token: string;
}
export default function Jwt() {
    const [apiEndpoint, setApiEndpoint] = useLocalStorage("apiEndpoint", "http://localhost:3000");
    const [jwtFormData, setJwtFormData] = useLocalStorage("jwtFormData", {});

    const [emailList, setEmailList] = useLocalStorage("emailList", []);
    const [secretKeyList, setSecretKeyList] = useLocalStorage("secretList", []);
    // const [alg, setAlg] = useLocalStorage("jwt_alg", "");
    // const [payload, setPayload] = useLocalStorage("jwt_payload", "");
    // const [token, setToken] = useLocalStorage("jwt_token", "");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let nav = document.querySelectorAll("nav ul li a.active");
        nav.forEach(n => n.removeAttribute("class"));
        document.getElementById('nav_jwt')?.setAttribute("class", "active");
    });

    function h_btnEmail(e: React.FormEvent<HTMLButtonElement>) {

        const _ddEmail = document.getElementById('ddEmail') as HTMLInputElement;
        const apiUrl = `${apiEndpoint}/mysql/query`; // Replace with your API URL
        axios.post(apiUrl, {
            type: "q",
            query: "select * from users.users where email = ? ",
            params: _ddEmail.value
        }).then(function (response) {
            let _uid = response.data[0].id
            let _jwtFormData = { ...jwtFormData }
            if (!_jwtFormData.payload) _jwtFormData.payload = { r: "user" };
            _jwtFormData.payload.em = _ddEmail.value;
            _jwtFormData.payload.uid = _uid;
            setJwtFormData(_jwtFormData);

            let _emailList: string[] = [...emailList];
            console.log(_emailList);
            
            if (!_emailList.find(e => { return (e === _ddEmail.value) })) {
                _emailList.push(_ddEmail.value);
                setEmailList(_emailList);
            }
            _ddEmail.value = "";
        })
            .catch(function (error) {
                console.log(error);

                if (error.code === "ERR_NETWORK") {
                    setErrorMsg(`Error: Kemungkinan API belum menyala.\nCoba jalankan perintah berikut di Terminal:\nnode ${__dirname}`);
                }
            });
    }
    function h_btnExpDate(e: React.FormEvent<HTMLButtonElement>) {
        const val = (document.getElementById('expDateDtp') as HTMLInputElement).value;
        const timestamp = Date.parse(val);

        let _jwtFormData = { ...jwtFormData }
        if (!_jwtFormData.payload) _jwtFormData.payload = { r: "user" };
        _jwtFormData.payload.exp = timestamp/1000;

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
                if (error.code === "ERR_NETWORK") {
                    setErrorMsg(`Error: Kemungkinan API belum menyala.\nCoba jalankan perintah berikut di Terminal:\nnode ${__dirname}`);
                }
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
                if (response.data) setJwtFormData({...jwtFormData, ...{ payload: response.data }});
            })
            .catch(function (error) {
                console.log(error.code);
            });
    }
    function h_btnCookies_click() {
        encode(async (t) => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            console.log(tab.id);
            if (tab.id) {
                const response = await chrome.tabs.sendMessage(tab.id, { token: t });
                setJwtFormData({ ...jwtFormData, ...{ token: t } });
                console.log(response);
            }
        });
    }

    const [epoch, setEpoch] = useLocalStorage("epoch", 0);
    const [date, setDate] = useLocalStorage("date", "");
    function h_dateTxt_click() {
        setEpoch(new Date(date).getTime() / 1000);
    }
    function h_epochTxt_click() {
        const _date = new Date(epoch * 1000);
        const sDatetime: string = _date.toLocaleString("id-ID").replace(", ", "/").replace(/\./g, "/");
        const arDatetime = sDatetime.split("/");
        const formattedDatetime = `${arDatetime[2]}-${arDatetime[1]}-${arDatetime[0]}T${arDatetime[3]}:${arDatetime[4]}`
        setDate(formattedDatetime);
    }
    return (
        <>
            <label htmlFor="apiEndpointTxt">Api Endpoint
                <input id="apiEndpointTxt" type="text" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} />
            </label>
            <fieldset id="groupEncode">
                <legend>Encoder</legend>
                <label htmlFor="txtSecretKey">Secret Key :
                    <input id="txtSecretKey" type="text" value={jwtFormData.secretKey} onChange={e => setJwtFormData({ ...jwtFormData, ...{ secretKey: e.target.value } })} />
                </label>
                <label htmlFor="ddAlgor">Algoritma :
                    <input id="ddAlgor" type="text" value={jwtFormData.algorithm} list="ddAlgor_list" onChange={e => setJwtFormData({ ...jwtFormData, ...{ algorithm: e.target.value } })} style={{ width: "75px" }} />
                    <datalist id="ddAlgor_list" >
                        {jwtAlgor.map((alg) => (
                            <option key={`ddAlgor_${alg.code}`} value={alg.code}></option>
                        ))}
                    </datalist>
                </label>
                <br />
                <label htmlFor="ddEmail">Email :
                    <input id="ddEmail" type="text" list="ddEmail_list" />
                    <datalist id="ddEmail_list" >
                        {emailList.map((email: string) => (
                            <option key={`emailDd_${email}`} value={email}></option>
                        ))}
                    </datalist>
                    <button id="btnEmail" onClick={e => h_btnEmail(e)}>Set Email</button>
                </label>
                <br />
                <label htmlFor="expDateDtp">Token exp. date</label>
                <input id="expDateDtp" type="datetime-local" />
                <button id="btnExpDate" onClick={e => h_btnExpDate(e)}>Set Exp Date</button>
                <br />

                <label htmlFor="txtPayload">Payload :
                    <textarea id="txtPayload" value={JSON.stringify(jwtFormData.payload)} onChange={e => setJwtFormData({ ...jwtFormData, ...{ payload: JSON.parse(e.target.value) } })} />
                </label>
                <button onClick={h_btnEncode_click}>Encode</button>
                <button onClick={h_btnCookies_click}>Inject to Cookies</button>
            </fieldset>
            <fieldset id="groupDecode">
                <legend>Decoder</legend>
                <label htmlFor="txtToken">Token : <button onClick={h_btnDecode_click}>Decode</button>
                </label>
                <textarea id="txtToken" value={jwtFormData.token} onChange={e => setJwtFormData({ ...jwtFormData, ...{ token: e.target.value } })} />
            </fieldset>
            <fieldset>
                <legend>Epoch</legend>
                <label htmlFor="dateTxt"></label>
                <input id="dateTxt" value={date} onChange={e => setDate(e.target.value)} type="datetime-local" />
                <label htmlFor="epochTxt"></label>
                <input id="epochTxt" value={epoch} onChange={e => setEpoch(parseInt(e.target.value))} type="number" />
                <button onClick={h_dateTxt_click}>Date to Epoch</button>
                <button onClick={h_epochTxt_click}>Epoch to Date</button>
            </fieldset>

        </>
    );
}