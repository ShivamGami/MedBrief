import { useContext, useEffect, useState } from "react";
import { API } from "../Config/Api";
import type { Doctor } from "../Config/Types";
import { AuthContext } from "../Context/AuthContext";
import "../Css/Pages/Doctors.css";

export default function Doctors() {
    const authContext = useContext(AuthContext);

    if (!authContext) return null;
    const { user } = authContext;

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [profileId, setProfileId] = useState("");
    const [assignMessage, setAssignMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const loadDoctors = async () => {
            setLoading(true);
            setMessage(null);
            try {
                if (user?.role === "doctor") {
                    const data = await API<any[]>("GET", "/personal/my-patients");
                    setPatients(data);
                } else {
                    const data = await API<Doctor>("GET", "/personal/my-doctor");
                    setDoctor(data);
                }
            } catch (error) {
                setMessage("Unable to load the clinical provider reference matrix.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.role) {
            loadDoctors();
        }
    }, [user?.role]);

    const assignPatient = async () => {
        if (!profileId.trim()) return;
        setAssignMessage("");
        setIsSuccess(false);

        try {
            await API("POST", `/personal/assign-patient/${profileId.trim()}`);
            setAssignMessage("Patient node reference linked successfully.");
            setIsSuccess(true);
            setProfileId("");

            const data = await API<any[]>("GET", "/personal/my-patients");
            setPatients(data);
        } catch {
            setAssignMessage("Failed to coordinate patient identification assignment.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="doctors-page-container">
            <header className="doctors-page-header">
                <div>
                    <h1 className="doctors-page-title">
                        {user?.role === "doctor" ? "Clinical Operations" : "Medical Practitioner"}
                    </h1>
                    <p className="doctors-page-subtitle">
                        {user?.role === "doctor"
                            ? "Manage assigned case files and establish node connections."
                            : "Your assigned primary healthcare clinical director profile parameters."}
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="doctors-state-alert">
                    <div className="doctors-loader-spin" />
                    <p>Syncing professional roster database files...</p>
                </div>
            ) : message ? (
                <div className="doctors-state-alert error">
                    <p>{message}</p>
                </div>
            ) : user?.role === "doctor" ? (
                <div className="doctor-workspace-layout">
                    <section className="doctors-glass-card assign-card-panel">
                        <h2 className="doctors-section-title">Link New Patient Node</h2>
                        <div className="doctors-form-group">
                            <label className="doctors-label-text">Patient Profile UUID Link</label>
                            <div className="doctors-input-row">
                                <input
                                    className="doctors-text-input"
                                    type="text"
                                    placeholder="Enter system profile id..."
                                    value={profileId}
                                    onChange={(e) => setProfileId(e.target.value)}
                                />
                                <button className="doctors-action-button" onClick={assignPatient}>
                                    Assign Patient
                                </button>
                            </div>
                        </div>
                        {assignMessage && (
                            <p className={`doctors-status-feedback ${isSuccess ? "success" : "error"}`}>
                                {assignMessage}
                            </p>
                        )}
                    </section>

                    <section className="doctors-glass-card patients-list-panel">
                        <h2 className="doctors-section-title">My Assigned Active Cases</h2>
                        {patients.length === 0 ? (
                            <div className="doctors-empty-view">
                                <p>No case profiles currently mapped to your clinician profile identifier token.</p>
                            </div>
                        ) : (
                            <div className="patients-grid-deck">
                                {patients.map((patient) => (
                                    <div key={patient.id} className="patient-profile-card">
                                        <div className="patient-card-header">
                                            <div className="patient-avatar-placeholder">
                                                {patient.name?.charAt(0) ?? "P"}
                                            </div>
                                            <div className="patient-meta-header">
                                                <h3 className="patient-name-label">{patient.name ?? "Anonymous Patient"}</h3>
                                                <span className="patient-id-badge">ID: {patient.id?.slice(0, 8)}...</span>
                                            </div>
                                        </div>
                                        <div className="patient-specs-grid">
                                            <div className="spec-metric-box">
                                                <span>Age</span>
                                                <span>{patient.age ?? "N/A"}</span>
                                            </div>
                                            <div className="spec-metric-box">
                                                <span>Gender</span>
                                                <span style={{ textTransform: "capitalize" }}>{patient.gender ?? "N/A"}</span>
                                            </div>
                                            <div className="spec-metric-box">
                                                <span>Height</span>
                                                <span>{patient.height ? `${patient.height} cm` : "N/A"}</span>
                                            </div>
                                            <div className="spec-metric-box">
                                                <span>Weight</span>
                                                <span>{patient.weight ? `${patient.weight} kg` : "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            ) : !doctor ? (
                <div className="doctors-glass-card doctors-empty-view">
                    <p>No primary clinical director currently assigned to your patient node profile authorization token.</p>
                </div>
            ) : (
                <section className="doctors-glass-card single-doctor-profile">
                    <div className="doctor-profile-hero">
                        <div className="doctor-large-avatar">
                            Dr
                        </div>
                        <div className="doctor-hero-meta">
                            <h2 className="doctor-profile-fullname">{doctor.name ?? "Specialist Healthcare Professional"}</h2>
                            <span className="doctor-specialization-badge">{doctor.specialization ?? "General Practitioner"}</span>
                        </div>
                    </div>

                    <div className="doctor-contact-matrix">
                        <div className="matrix-data-row">
                            <span className="matrix-label">System Node ID:</span>
                            <span className="matrix-value system-uuid">{doctor.id}</span>
                        </div>
                        <div className="matrix-data-row">
                            <span className="matrix-label">Secure Contact Mail:</span>
                            <span className="matrix-value">{doctor.email ?? "No secure routing mail provided"}</span>
                        </div>
                        <div className="matrix-data-row">
                            <span className="matrix-label">Telecom Line:</span>
                            <span className="matrix-value">{doctor.phone ?? "No direct cellular routing configured"}</span>
                        </div>
                        <div className="matrix-data-row">
                            <span className="matrix-label">Medical Board License:</span>
                            <span className="matrix-value secure-license">{doctor.license_number ?? "Verification pending"}</span>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}