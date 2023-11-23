import { useReducer, useState } from "react";
import TextBox from "../../components/TextBox";
import useLocalStorage from "../../hooks/useLocalStorage";
import SpinEdit from "../../components/SpinEdit";
import "./Setting.css"
import { TConfig, TDbConfig, initConfig } from "../../const/db";

const ACT = {
    ADD: "ADD",
    EDIT: "EDIT",
    DELETE: "DELETE",
    SELECT: "SELECT"
}

interface Action {
    type: string;
    payload: TConfig;
}
function reducer(state: TConfig[], action: Action) {
    const { type, payload } = action;
    let result = state;
    switch (type) {
        case ACT.ADD:
            result =  [...state, payload];
        default:
            localStorage.setItem("TConfigs", JSON.stringify(result));
            return result;
    }
}
export default function Settings() {
    let lsDbConfig:TConfig[] = JSON.parse(localStorage.getItem("TConfigs")||JSON.stringify([initConfig]));
    const [currConfig, setCurrConfig] = useLocalStorage<TConfig>("TConfigForm",initConfig);
    const [state, dispatch] = useReducer(reducer, lsDbConfig);
    return (
        <fieldset>
            <legend>SQL Connection</legend>
            <form onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: ACT.ADD, payload: currConfig });
                setCurrConfig(initConfig);
            }}>
                <TextBox value={currConfig?.name} onChange={(e) => setCurrConfig({ ...currConfig, ...{ name: e.target.value }})} id="name" label="Name:" required={true} />
                <fieldset><legend>DB Config</legend>
                <br /><TextBox value={currConfig?.dbConfig.host || ""} onChange={(e) => setCurrConfig({ ...currConfig,  dbConfig:{...currConfig.dbConfig,host: e.target.value} })} id="host" label="Host:" />
                <br /><TextBox value={currConfig?.dbConfig.user || ""} onChange={(e) => setCurrConfig({ ...currConfig, dbConfig:{...currConfig.dbConfig,user: e.target.value }})} id="user" label="user:" />
                <br /><TextBox value={currConfig?.dbConfig.password || ""} onChange={(e) => setCurrConfig({ ...currConfig, dbConfig:{...currConfig.dbConfig,password: e.target.value }})} id="password" label="password:" />
                <br /><SpinEdit value={currConfig?.dbConfig.port || ""} onChange={(e) => setCurrConfig({ ...currConfig, dbConfig:{...currConfig.dbConfig,port: parseInt(e.target.value) || 3306 }})} id="port" label="port:" />
                <br /><SpinEdit value={currConfig?.dbConfig.connectTimeout || ""} onChange={(e) => setCurrConfig({ ...currConfig, dbConfig:{...currConfig.dbConfig,connectTimeout: parseInt(e.target.value) || 30000 }})} id="connectTimeout" label="connectTimeout:" />
                </fieldset>
                <fieldset><legend>JWT</legend>
                <br /><TextBox value={currConfig?.jwtConfig.secretKey || ""} onChange={(e) => setCurrConfig({ ...currConfig, jwtConfig:{...currConfig.jwtConfig,secretKey: e.target.value}})} id="secretKey" label="secretKey:" />
                <br /><TextBox value={currConfig?.jwtConfig.algorithm || ""} onChange={(e) => setCurrConfig({ ...currConfig, jwtConfig:{...currConfig.jwtConfig,algorithm: e.target.value }})} id="algoritma" label="algoritma:" />
                <br /><TextBox value={currConfig?.jwtConfig.expiredDate || ""} onChange={(e) => setCurrConfig({ ...currConfig, jwtConfig:{...currConfig.jwtConfig,expiredDate: e.target.value }})} id="expiredDate" label="expiredDate:" />
                </fieldset>
                <br /><input type="submit" value="Add" />
            </form>
            <table className="tblDbConfig">
                <tr><th>Name</th><th>Host</th><th>User</th><th>Port</th><th>TimeOut</th><th>Action</th></tr>
                {state.map((row)=>(
                    <tr><td>{row.name}</td><td>{row.dbConfig.host}</td><td>{row.dbConfig.user}</td><td>{row.dbConfig.port}</td><td>{row.dbConfig.connectTimeout}</td><td><button onClick={(e)=>alert("Belum bisa coy")}>Delete</button></td></tr>
                ))}
            </table>
        </fieldset>
    );
}