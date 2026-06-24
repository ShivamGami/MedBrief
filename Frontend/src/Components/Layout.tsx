import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
    return (
        <div className="appMainLayoutContainer">
            <Sidebar />

            <main className="page-content-wrapper">
                <Outlet />
            </main>
        </div>
    );
}