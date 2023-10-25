import React from 'react';
import { createRoot } from 'react-dom/client';
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./index.css";
import Home from './Home/Home';
import Settings from './Settings/Settings';
import Jwt from './Jwt/Jwt';
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
    <Router>
        <nav>
            <ul className='nav'>
                <li><a href="#/" id='nav_jwt'>JWT</a></li>
                <li><a href="#/home" id='nav_jwt2'>JWT</a></li>
            </ul>
        </nav>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Jwt />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
    </Router>
);