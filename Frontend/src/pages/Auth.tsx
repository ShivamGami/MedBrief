import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Auth, User } from "../Config/Types";
import { AuthContext } from "../Context/AuthContext";
import "../Css/Pages/Auth.css"

const getInitialRole = (): Auth["role"] => {
    const queryRole = new URLSearchParams(window.location.search).get("role")?.toLowerCase();
    return queryRole === "doctor" ? "doctor" : "patient";
};

export default function Auth() {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext.Provider is required.");

    const { setrole, setUser } = authContext;
    const navigate = useNavigate();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [auth, setauth] = useState<Auth>({
        email: null,
        password: null,
        role: getInitialRole(),
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setrole(auth.role);
    }, [auth.role, setrole]);

    useEffect(() => {
        if (localStorage.getItem("access")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const loginfunc = (name: keyof Auth, value: Auth[keyof Auth]) => {
        setauth(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const chooseRole = (selectedRole: Auth["role"]) => {
        setauth(prev => ({ ...prev, role: selectedRole }));
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadCurrentUser = async (token: string): Promise<User> => {
        const response = await fetch(`${backendUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Could not load user data");
        return response.json() as Promise<User>;
    };

    const handleSubmit = async () => {
        setMessage(null);

        if (!auth.email || !auth.password) {
            setMessage("Please enter email and password.");
            return;
        }

        if (mode === "signup" && auth.password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            if (mode === "signup") {
                const signupResponse = await fetch(`${backendUrl}/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: auth.email, password: auth.password, role: auth.role }),
                });

                if (!signupResponse.ok) throw new Error("Signup failed.");

                const loginResponse = await fetch(`${backendUrl}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: auth.email, password: auth.password, role: auth.role }),
                });

                const data = await loginResponse.json();
                if (!loginResponse.ok) throw new Error("Auto-login failed after signup.");

                localStorage.setItem("access", data.access_token);
                localStorage.setItem("refresh", data.refresh_token);

                const userData = await loadCurrentUser(data.access_token);
                setUser(userData);
                setrole(userData.role);

                navigate("/profile");

            } else {
                const response = await fetch(`${backendUrl}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: auth.email, password: auth.password, role: auth.role }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.detail || "Login failed.");

                localStorage.setItem("access", data.access_token);
                localStorage.setItem("refresh", data.refresh_token);

                const userData = await loadCurrentUser(data.access_token);
                setUser(userData);
                setrole(userData.role);
                navigate("/dashboard");
            }
        } catch (error: any) {
            setMessage(error.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) handleSubmit();
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-logo">
                        <div className="auth-icon-ring auth-icon-ring-1" />
                        <div className="auth-icon-ring auth-icon-ring-2" />
                        <div className="auth-icon-ring auth-icon-ring-3" />
                        <div className="auth-icon-inner">
                            <svg
                                className="auth-icon-svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 12h3l2-7 4 14 2-7h7" />
                                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" opacity="0.3" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="auth-title">MedBrief</h1>
                    <p className="auth-subtitle">Secure clinical portal</p>
                </div>

                <div className="auth-toggle">
                    <button
                        type="button"
                        className={`auth-tab ${mode === "login" ? "active" : ""}`}
                        disabled={mode === "login"}
                        onClick={() => { setMode("login"); setMessage(null); }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                        disabled={mode === "signup"}
                        onClick={() => { setMode("signup"); setMessage(null); }}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="auth-form">
                    <label className="auth-field">
                        <span className="auth-field-label">Email</span>
                        <input
                            className="auth-input"
                            type="email"
                            value={auth.email ?? ""}
                            onChange={e => loginfunc("email", e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </label>

                    <label className="auth-field">
                        <span className="auth-field-label">Password</span>
                        <input
                            className="auth-input"
                            type="password"
                            value={auth.password ?? ""}
                            onChange={e => loginfunc("password", e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your password"
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                        />
                    </label>

                    {mode === "signup" && (
                        <label className="auth-field">
                            <span className="auth-field-label">Confirm Password</span>
                            <input
                                className="auth-input"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                            />
                        </label>
                    )}
                </div>

                {mode == "signup" && <div className="auth-role-group">
                    <span className="auth-role-label">Select your role</span>
                    <button
                        type="button"
                        className={`auth-role-button ${auth.role === "patient" ? "selected" : ""}`}
                        onClick={() => chooseRole("patient")}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        className={`auth-role-button ${auth.role === "doctor" ? "selected" : ""}`}
                        onClick={() => chooseRole("doctor")}
                    >
                        Doctor
                    </button>

                    <p className="auth-selected-role">
                        Selected role: <strong>{auth.role}</strong>
                    </p>
                </div>}

                <button
                    type="button"
                    className="auth-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : mode === "login" ? "Login" : "Sign Up"}
                </button>

                {message && <p className="auth-message">{message}</p>}
            </div>
        </div>
    );
}