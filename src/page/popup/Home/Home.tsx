import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        let nav = document.querySelectorAll("nav ul li a.active");
        nav.forEach(n=>n.removeAttribute("class"));
        document.getElementById('nav_jwt2')?.setAttribute("class", "active");
    });
    return (
        <div>Home</div>
    );
}