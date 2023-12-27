import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Jwt from "./Home/Jwt/Jwt";
import Settings from "./Settings/Settings";
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { TConfig, initConfig } from "../const/db";
import Query from "./Query/Query";
import Json from "./Json/Json";

function NavItem({ href, id, label, activeNav, setActiveNav }: { href: string, id: string, label: string, activeNav: string, setActiveNav: (navId: string) => void }) {
    return (
        <li><a href={href} id={id} className={(activeNav === id) ? "active" : ""} onClick={e => setActiveNav(id)}>{label}</a></li>
    );
}
export default function App() {
    const [activeNav, setActiveNav] = useState("home_nav");
    const [apiEndpoint, setApiEndpoint] = useLocalStorage<string>("apiEndpoint", "http://localhost:3000");
    const [curConfig, setCurConfig] = useLocalStorage<TConfig>("currConfig", initConfig);
    const _TConfigList = JSON.parse(localStorage.getItem("TConfigs") || "[]");

    return (
        <>
            <nav>
                <ul className='nav'>
                    <NavItem href="#/" id="home_nav" label="Home" activeNav={activeNav} setActiveNav={setActiveNav} />
                    <NavItem href="#/jwt" id="jwt_nav" label="JWT" activeNav={activeNav} setActiveNav={setActiveNav} />
                    <NavItem href="#/json" id="json_nav" label="Json" activeNav={activeNav} setActiveNav={setActiveNav} />
                    <NavItem href="#/query" id="query_nav" label="Query" activeNav={activeNav} setActiveNav={setActiveNav} />
                    <NavItem href="#/settings" id="settings_nav" label="Settings" activeNav={activeNav} setActiveNav={setActiveNav} />
                    {/* <li><a href="#/" id='home_nav' className={(activeNav==="home_nav")?"active":""} onClick={e=>setActiveNav("home_nav")}>Home</a></li>
                    <li><a href="#/jwt" id='jwt_nav' className={(activeNav==="jwt_nav")?"active":""} onClick={e=>setActiveNav("jwt_nav")}>JWT</a></li> */}
                </ul>
            </nav>
            <label htmlFor="apiEndpointTxt">Api Endpoint
                <input id="apiEndpointTxt" type="text" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} />
            </label>
            <label>Environment
                <select name="environmentDd" id="environmentDd" value={curConfig.name} onChange={(e) => {
                    const _Config:TConfig = _TConfigList.find((conf: TConfig) => {
                        if (conf.name.trim().toLowerCase() === e.target.value.trim().toLowerCase())
                            return conf;
                    })
                    setCurConfig(_Config);
                }}>
                    {_TConfigList.map((conf: TConfig) => (
                        <option key={`conf_${conf.name}`} value={conf.name}>{conf.name}</option>
                    ))}
                </select>
            </label>
            <Routes>
                <Route path="/" element={<Home apiEndpoint={apiEndpoint} config={curConfig} />} />
                <Route path="/jwt" element={<Jwt apiEndpoint={apiEndpoint} config={curConfig} />} />
                <Route path="/json" element={<Json />} />
                <Route path="/query" element={<Query apiEndpoint={apiEndpoint} config={curConfig} />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    );
}