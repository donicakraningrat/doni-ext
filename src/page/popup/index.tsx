import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import App from './App';
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
    <Router>
        <App/>
    </Router>
);