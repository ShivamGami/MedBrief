import { useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { API } from "./Config/Api";
import { AuthContext } from "./Context/AuthContext";

import Intro from "./pages/Intro";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import UploadPrescription from "./pages/Upload_prescription";

import "./index.css";

import Sidebar from "./Components/Sidebar";
import ProtectedRoute from "./Components/ProtectedRoute";
import type { User } from "./Config/Types";

const App = () => {
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const [loadingUser, setLoadingUser] = useState(false);
    
    const isAuthPage = location.pathname === "/" || location.pathname === "/login";

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (!access || !authContext) {
            return;
        }

        if (authContext.user) {
            return;
        }

        setLoadingUser(true);
        API<User>("GET", "/auth/me")
            .then(user => {
                authContext.setUser(user);
                authContext.setrole(user.role);
            })
            .catch(() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
            })
            .finally(() => setLoadingUser(false));
    }, [authContext]);

    if (loadingUser) {
        return <div className="app-loading">Loading your session…</div>;
    }

    if (isAuthPage) {
        return (
            <div style={{ width: "100vw", minHeight: "100vh", margin: 0, padding: 0 }}>
                <Routes>
                    <Route path="/" element={<Intro />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="appMainLayoutContainer">
            <Sidebar />

            <main className="page-content-wrapper">
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appointments"
                        element={
                            <ProtectedRoute>
                                <Appointments />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/doctors"
                        element={
                            <ProtectedRoute>
                                <Doctors />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <Chat />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/prescriptions"
                        element={
                            <ProtectedRoute>
                                <Prescriptions />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/uploadprescription"
                        element={
                            <ProtectedRoute>
                                <UploadPrescription />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;