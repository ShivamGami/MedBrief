import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "../Css/Sidebar.css";

const navItems = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: "📊",
    },
    {
        to: "/profile",
        label: "Profile",
        icon: "👤",
    },
    {
        to: "/appointments",
        label: "Appointments",
        icon: "📅",
    },
    {
        to: "/doctors",
        label: "Doctors",
        icon: "🩺",
    },
    {
        to: "/chat",
        label: "Chat",
        icon: "💬",
    },
    {
        to: "/prescriptions",
        label: "Prescriptions",
        icon: "💊",
    },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);

    if (!authContext) return null;

    const { user, setUser, setrole } = authContext;

    useEffect(() => {
        const rootContainer = document.querySelector(
            ".appMainLayoutContainer"
        );

        if (!rootContainer) return;

        if (isCollapsed) {
            rootContainer.classList.add("sidebar-is-collapsed");
        } else {
            rootContainer.classList.remove("sidebar-is-collapsed");
        }
    }, [isCollapsed]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
        setrole(null);

        navigate("/login");
    };

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    return (
        <nav className={`navbar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="navbar-header">
                <div className="navbar-brand">
                    <div className="navbar-logo">MB</div>

                    {!isCollapsed && (
                        <span className="navbar-title">
                            MedBrief
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="navbar-toggle"
                    onClick={toggleSidebar}
                >
                    {isCollapsed ? "➔" : "❮"}
                </button>
            </div>

            <div className="navbar-nav">
                {[
                    ...navItems,
                    ...(user?.role === "doctor"
                        ? [
                            {
                                to: "/uploadprescription",
                                label: "Upload Prescription",
                                icon: "📝",
                            },
                        ]
                        : []),
                ].map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`navbar-link ${location.pathname === item.to
                                ? "active"
                                : ""
                            }`}
                    >
                        <span className="nav-icon">
                            {item.icon}
                        </span>

                        {!isCollapsed && (
                            <span className="nav-label">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            <div className="navbar-footer">
                <div
                    className={`navbar-user ${isCollapsed ? "collapsed" : ""
                        }`}
                >
                    <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase() ??
                            "?"}
                    </div>

                    {!isCollapsed && (
                        <div className="user-info">
                            <span className="user-name">
                                {user?.username ?? "User"}
                            </span>

                            <span className="user-role">
                                {user?.role ?? ""}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="navbar-logout"
                    onClick={handleLogout}
                >
                    <span className="nav-icon">🚪</span>

                    {!isCollapsed && (
                        <span className="nav-label">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}