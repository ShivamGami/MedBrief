import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../Config/Api";
import { AuthContext } from "../Context/AuthContext";
import type { Prescription } from "../Config/Types";
import "../Css/Pages/Prescription.css";

export default function Prescriptions() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) throw new Error("AuthContext.Provider is required.");

    const { user } = authContext;
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [profileId, setProfileId] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [showActive, setShowActive] = useState(true);

    const loadPrescriptions = async (isActive: boolean) => {
        if (!profileId.trim()) {
            setMessage("Please enter a valid patient profile verification ID.");
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const endpoint = isActive
                ? `/prescriptions/active/${profileId.trim()}`
                : `/prescriptions/history/${profileId.trim()}`;
            const data = await API<Prescription[]>("GET", endpoint);
            setPrescriptions(data);
        } catch (error) {
            setMessage("Unable to load prescriptions. Verify target node configuration identification.");
            setPrescriptions([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMyPrescriptions = async (isActive: boolean) => {
        setLoading(true);
        setMessage(null);
        try {
            const endpoint = isActive
                ? "/prescriptions/my-active"
                : "/prescriptions/my-history";

            const data = await API<Prescription[]>("GET", endpoint);
            setPrescriptions(data);
        } catch {
            setMessage("Unable to coordinate secure prescription database link.");
            setPrescriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (!access) {
            navigate("/login");
            return;
        }

        if (!user) {
            navigate("/dashboard");
            return;
        }

        setLoading(false);

        if (user?.role === "patient") {
            loadMyPrescriptions(showActive);
        }
    }, [navigate, user]);

    const handleToggleFilter = (activeState: boolean) => {
        setShowActive(activeState);
        if (user?.role === "patient") {
            loadMyPrescriptions(activeState);
        } else if (user?.role === "doctor" && profileId.trim()) {
            loadPrescriptions(activeState);
        }
    };

    if (!user) {
        return (
            <div className="rx-state-alert error">
                <p>System configuration map access denied. Token authorization invalid.</p>
            </div>
        );
    }

    return (
        <div className="rx-page-container">
            <header className="rx-page-header">
                <div>
                    <h1 className="rx-page-title">Medication Framework</h1>
                    <p className="rx-page-subtitle">
                        {user.role === "doctor"
                            ? "Review and monitor treatment protocol distribution plans."
                            : "Track real-time pharmaceutical prescriptions and tracking arrays."}
                    </p>
                </div>
            </header>

            {user.role === "doctor" && (
                <section className="rx-glass-card rx-search-workspace">
                    <div className="rx-card-header">
                        <h2 className="rx-section-title">Query Patient Archives</h2>
                        <p className="rx-section-desc">Provide patient record hash token key below to pull treatment arrays</p>
                    </div>

                    <div className="rx-form-group">
                        <label className="rx-label-text">Patient Profile UUID Node</label>
                        <div className="rx-input-row">
                            <input
                                className="rx-text-input"
                                value={profileId}
                                onChange={e => setProfileId(e.target.value)}
                                placeholder="Enter system security hash token..."
                            />
                            <div className="rx-button-split-group">
                                <button
                                    type="button"
                                    className={`rx-toggle-btn ${showActive ? "active" : ""}`}
                                    onClick={() => handleToggleFilter(true)}
                                    disabled={loading}
                                >
                                    View Active
                                </button>
                                <button
                                    type="button"
                                    className={`rx-toggle-btn secondary ${!showActive ? "active" : ""}`}
                                    onClick={() => handleToggleFilter(false)}
                                    disabled={loading}
                                >
                                    View History
                                </button>
                            </div>
                        </div>
                    </div>

                    {message && <p className="rx-status-feedback error">{message}</p>}
                </section>
            )}

            {user.role === "patient" && (
                <div className="rx-segmented-wrapper">
                    <button
                        className={`rx-segment-tab ${showActive ? "active" : ""}`}
                        onClick={() => handleToggleFilter(true)}
                    >
                        Active Prescriptions
                    </button>
                    <button
                        className={`rx-segment-tab ${!showActive ? "active" : ""}`}
                        onClick={() => handleToggleFilter(false)}
                    >
                        Historical Logs
                    </button>
                </div>
            )}

            <section className="rx-glass-card rx-results-workspace">
                <div className="rx-card-header">
                    <h2 className="rx-section-title">
                        {showActive ? "Active Pharmacological Directives" : "Archived Directives Log"}
                    </h2>
                </div>

                {loading ? (
                    <div className="rx-state-alert">
                        <div className="rx-loader-spin" />
                        <p>Accessing medical mainframe logs...</p>
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="rx-empty-view">
                        <p>No recorded prescriptions match this active filter profile path node.</p>
                    </div>
                ) : (
                    <div className="rx-grid-deck">
                        {prescriptions.map((rx, idx) => (
                            <div key={String(rx.id) || idx} className="rx-profile-card">
                                <div className="rx-card-top">
                                    <div className="rx-med-icon-box">Rx</div>
                                    <div className="rx-meta-header">
                                        <h3 className="rx-medication-name">
                                            {rx.medicine?.name ?? "Unspecified Compound"}
                                        </h3>
                                        <span className={`rx-status-badge ${rx.is_active ? "active" : "inactive"}`}>
                                            {rx.is_active ? "Active Protocol" : "Terminated"}
                                        </span>
                                    </div>
                                </div>

                                <div className="rx-specs-grid">
                                    <div className="rx-spec-box long">
                                        <span>Dosage Guidelines</span>
                                        <p>{rx.dosage_instructions ?? "As directed by medical supervisor"}</p>
                                    </div>
                                    <div className="rx-spec-box">
                                        <span>Frequency / Day</span>
                                        <p>{rx.duration ?? "N/A"}</p>
                                    </div>
                                    <div className="rx-spec-box">
                                        <span>Strength Metric</span>
                                        <p>{rx.medicine?.strength ?? "Standard"}</p>
                                    </div>
                                    <div className="rx-spec-box long">
                                        <span>Form Factor Unit</span>
                                        <p>{rx.medicine?.dosage_form ?? "Tablet/Capsule"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}