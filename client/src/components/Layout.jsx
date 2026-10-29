import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";import Navbar from "./Navbar";
export default function Layout(){
    return <div className="app-shell"><Sidebar/><main className="main-area"><Navbar/><div className="page-content"><Outlet/></div><footer className="footer">CareerIntel <span>·</span> AI-assisted career guidance <span className="footer-note">Scores are guidance, not hiring probabilities.</span></footer></main></div>}
