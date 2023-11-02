import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Jwt from "./Home/Jwt/Jwt";
import Settings from "./Settings/Settings";
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { TDbConfig, initDbConfig } from "../const/db";

function NavItem({ href, id, label, activeNav, setActiveNav }: { href: string, id: string, label: string, activeNav: string, setActiveNav: (navId: string) => void }) {
    return (
        <li><a href={href} id={id} className={(activeNav === id) ? "active" : ""} onClick={e => setActiveNav(id)}>{label}</a></li>
    );
}
export default function App() {
    const [activeNav, setActiveNav] = useState("home_nav");
    const [apiEndpoint, setApiEndpoint] = useLocalStorage("apiEndpoint", "http://localhost:3000");
    const [sqlConn, setSqlConn] = useLocalStorage("usedSqlConn", initDbConfig);
    const _dbConfigList = JSON.parse(localStorage.getItem("dbConfig") || "[]");

    return (
        <>
            <nav>
                <ul className='nav'>
                    <NavItem href="#/" id="home_nav" label="Home" activeNav={activeNav} setActiveNav={setActiveNav} />
                    <NavItem href="#/jwt" id="jwt_nav" label="JWT" activeNav={activeNav} setActiveNav={setActiveNav} />
                    <NavItem href="#/settings" id="settings_nav" label="Settings" activeNav={activeNav} setActiveNav={setActiveNav} />
                    {/* <li><a href="#/" id='home_nav' className={(activeNav==="home_nav")?"active":""} onClick={e=>setActiveNav("home_nav")}>Home</a></li>
                    <li><a href="#/jwt" id='jwt_nav' className={(activeNav==="jwt_nav")?"active":""} onClick={e=>setActiveNav("jwt_nav")}>JWT</a></li> */}
                </ul>
            </nav>
            <label htmlFor="apiEndpointTxt">Api Endpoint
                <input id="apiEndpointTxt" type="text" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} />
            </label>
            <label htmlFor="sqlConnTxt">SQL Connection
                <select name="sqlConnDd" id="sqlConnDd" value={sqlConn.name} onChange={(e) => {
                    const _dbConfig = _dbConfigList.find((conf: TDbConfig) => {
                        if (conf.name.trim().toLowerCase() === e.target.value.trim().toLowerCase())
                            return conf;
                    })
                    setSqlConn(_dbConfig);
                }}>
                    {_dbConfigList.map((conf: TDbConfig) => (
                        <option key={`sqlConn_${conf.name}`} value={conf.name}>{conf.name}</option>
                    ))}
                </select>
            </label>
            <Routes>
                <Route path="/" element={<Home apiEndpoint={apiEndpoint} sqlConn={sqlConn} />} />
                <Route path="/jwt" element={<Jwt apiEndpoint={apiEndpoint} sqlConn={sqlConn} />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    );
}