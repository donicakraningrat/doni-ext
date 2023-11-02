import { useReducer, useState } from "react";
import TextBox from "../../components/TextBox";
import useLocalStorage from "../../hooks/useLocalStorage";
import SpinEdit from "../../components/SpinEdit";
import "./Setting.css"
import { TDbConfig, initDbConfig } from "../../const/db";

const ACT = {
    ADD: "ADD",
    EDIT: "EDIT",
    DELETE: "DELETE",
    SELECT: "SELECT"
}

interface Action {
    type: string;
    payload: TDbConfig;
}
function reducer(state: TDbConfig[], action: Action) {
    const { type, payload } = action;
    let result = state;
    switch (type) {
        case ACT.ADD:
            result =  [...state, payload];
        default:
            localStorage.setItem("dbConfig", JSON.stringify(result));
            return result;
    }
}
export default function Settings() {
    let lsDbConfig:TDbConfig[] = JSON.parse(localStorage.getItem("dbConfig")||JSON.stringify([initDbConfig]));
    const [currConfig, setCurrConfig] = useLocalStorage("dbConfigForm",initDbConfig);
    const [state, dispatch] = useReducer(reducer, lsDbConfig);
    return (
        <fieldset>
            <legend>SQL Connection</legend>
            <form onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: ACT.ADD, payload: currConfig });
                setCurrConfig(initDbConfig);
            }}>
                <TextBox value={currConfig?.name} onChange={(e) => setCurrConfig({ ...currConfig, ...{ name: e.target.value } })} id="name" label="Name:" required={true} />
                <br /><TextBox value={currConfig?.host || ""} onChange={(e) => setCurrConfig({ ...currConfig, ...{ host: e.target.value } })} id="host" label="Host:" />
                <br /><TextBox value={currConfig?.user || ""} onChange={(e) => setCurrConfig({ ...currConfig, ...{ user: e.target.value } })} id="user" label="user:" />
                <br /><TextBox value={currConfig?.password || ""} onChange={(e) => setCurrConfig({ ...currConfig, ...{ password: e.target.value } })} id="password" label="password:" />
                <br /><SpinEdit value={currConfig?.port || ""} onChange={(e) => setCurrConfig({ ...currConfig, ...{ port: parseInt(e.target.value) || 3306 } })} id="port" label="port:" />
                <br /><SpinEdit value={currConfig?.connectTimeout || ""} onChange={(e) => setCurrConfig({ ...currConfig, ...{ connectTimeout: parseInt(e.target.value) || 30000 } })} id="connectTimeout" label="connectTimeout:" />
                <br /><input type="submit" value="Add" />
            </form>
            <table className="tblDbConfig">
                <tr><th>Name</th><th>Host</th><th>User</th><th>Port</th><th>TimeOut</th><th>Action</th></tr>
                {state.map((row)=>(
                    <tr><td>{row.name}</td><td>{row.host}</td><td>{row.user}</td><td>{row.port}</td><td>{row.connectTimeout}</td><td><button onClick={(e)=>alert("Belum bisa coy")}>Delete</button></td></tr>
                ))}
            </table>
        </fieldset>
    );
}