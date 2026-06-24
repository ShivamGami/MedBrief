import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../Config/Api";
import { AuthContext } from "../Context/AuthContext";
import type { Doctor, Profile as PatientProfile } from "../Config/Types";
import "../Css/Pages/Profile.css";

const GENDER_LABELS: Record<string | number, string> = {
    1: "Male",
    2: "Female",
    3: "Other"
};

export default function Profile() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) throw new Error("AuthContext.Provider is required.");

    const { user } = authContext;
    const [profile, setProfile] = useState<Doctor | PatientProfile | null>(null);
    const [patients, setPatients] = useState<PatientProfile[]>([]);
    const [editData, setEditData] = useState<Record<string, string>>({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        license_number: "",
        age: "",
        gender: "1",
        weight: "",
        height: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (!access) {
            navigate("/login");
            return;
        }

        if (!user) return;

        const loadProfile = async () => {
            setLoading(true);
            setIsError(false);
            try {
                const endpoint = user.role === "doctor"
                    ? `/personal/doctors/user/${user.id}`
                    : `/personal/profiles/user/${user.id}`;
                
                const data = await API<Doctor | PatientProfile>("GET", endpoint);
                setProfile(data);
                
                setEditData({
                    name: data.name ?? "",
                    email: "email" in data ? (data.email ?? "") : "",
                    phone: "phone" in data ? (data.phone ?? "") : "",
                    specialization: "specialization" in data ? (data.specialization ?? "") : "",
                    license_number: "license_number" in data ? (data.license_number ?? "") : "",
                    age: "age" in data ? String(data.age ?? "") : "",
                    gender: "gender" in data ? String(data.gender ?? "1") : "1",
                    weight: "weight" in data ? String(data.weight ?? "") : "",
                    height: "height" in data ? String(data.height ?? "") : "",
                });

                if (user.role === "doctor" && data.id) {
                    const patientsData = await API<PatientProfile[]>("GET", `/personal/doctors/${data.id}/patients`);
                    setPatients(patientsData);
                }
            } catch (error) {
                setIsError(true);
                setMessage("Unable to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate, user]);

    const handleSave = async () => {
        if (!profile || !user) return;
        setMessage(null);
        setIsError(false);
        setSaving(true);

        try {
            if (user.role === "doctor" && "id" in profile && profile.id) {
                const body = {
                    name: editData.name,
                    email: editData.email,
                    phone: editData.phone,
                    specialization: editData.specialization,
                    license_number: editData.license_number,
                };
                const updated = await API<Doctor>("PUT", `/personal/doctors/${profile.id}`, body);
                setProfile(updated);
                setMessage("Doctor profile updated successfully.");
            }
            
            if (user.role === "patient" && "id" in profile && profile.id) {
                const body = {
                    name: editData.name,
                    age: editData.age ? Number(editData.age) : null,
                    gender: Number(editData.gender),
                    weight: editData.weight ? Number(editData.weight) : null,
                    height: editData.height ? Number(editData.height) : null,
                };
                const updated = await API<PatientProfile>("PUT", `/personal/profiles/${profile.id}`, body);
                setProfile(updated);
                setMessage("Patient profile updated successfully.");
            }
        } catch (error) {
            setIsError(true);
            setMessage("Unable to save profile changes.");
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("ID copied to clipboard!");
    };

    if (!user) {
        return <div className="page-content"><p>Redirecting or validating authentication...</p></div>;
    }

    return (
        <div className="page-content">
            <h1 className="page-title">Profile</h1>

            {loading ? (
                <p>Loading profile information...</p>
            ) : profile ? (
                <div className="profile-container">
                    
                    <div className="profile-card data-summary-card">
                        {user.role === "doctor" ? (
                            <div className="table-card">
                                <h2>Doctor Overview</h2>
                                <p><strong>Name:</strong> {profile.name}</p>
                                {"specialization" in profile && <p><strong>Specialization:</strong> {profile.specialization}</p>}
                                {"email" in profile && <p><strong>Email:</strong> {profile.email}</p>}
                                {"phone" in profile && <p><strong>Phone:</strong> {profile.phone}</p>}
                                <p><strong>System Role:</strong> {user.role}</p>
                                {profile.id && (
                                    <div className="profile-id-row" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                        <p style={{ margin: 0 }}><strong>Doctor ID:</strong> <code>{profile.id}</code></p>
                                        <button
                                            type="button"
                                            className="page-button copy-btn"
                                            style={{ padding: "2px 8px", fontSize: "12px", marginTop: 0 }}
                                            onClick={() => copyToClipboard(String(profile.id))}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="table-card">
                                <h2>Patient Overview</h2>
                                <p><strong>Name:</strong> {profile.name}</p>
                                <p><strong>System Role:</strong> {user.role}</p>
                                {profile.id && (
                                    <div className="profile-id-row" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                        <p style={{ margin: 0 }}><strong>Patient ID:</strong> <code>{profile.id}</code></p>
                                        <button
                                            type="button"
                                            className="page-button copy-btn"
                                            style={{ padding: "2px 8px", fontSize: "12px", marginTop: 0 }}
                                            onClick={() => copyToClipboard(String(profile.id))}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="profile-card form-edit-card">
                        <h2>Edit Profile Details</h2>
                        <div className="profile-form">
                            <label className="form-label">
                                Name
                                <input
                                    className="form-input"
                                    value={editData.name}
                                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </label>

                            {user.role === "doctor" ? (
                                <>
                                    <label className="form-label">
                                        Specialization
                                        <input
                                            className="form-input"
                                            value={editData.specialization}
                                            onChange={(e) => setEditData(prev => ({ ...prev, specialization: e.target.value }))}
                                        />
                                    </label>
                                    <label className="form-label">
                                        Email
                                        <input
                                            className="form-input"
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </label>
                                    <label className="form-label">
                                        Phone
                                        <input
                                            className="form-input"
                                            type="tel"
                                            value={editData.phone}
                                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </label>
                                    <label className="form-label">
                                        License Number
                                        <input
                                            className="form-input"
                                            value={editData.license_number}
                                            onChange={(e) => setEditData(prev => ({ ...prev, license_number: e.target.value }))}
                                        />
                                    </label>
                                </>
                            ) : (
                                <>
                                    <label className="form-label">
                                        Age
                                        <input
                                            className="form-input"
                                            type="number"
                                            value={editData.age}
                                            onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                                        />
                                    </label>
                                    <label className="form-label">
                                        Gender
                                        <select
                                            className="form-input"
                                            value={editData.gender}
                                            onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                                        >
                                            <option value="1">Male</option>
                                            <option value="2">Female</option>
                                            <option value="3">Other</option>
                                        </select>
                                    </label>
                                    <label className="form-label">
                                        Weight (kg)
                                        <input
                                            className="form-input"
                                            type="number"
                                            value={editData.weight}
                                            onChange={(e) => setEditData(prev => ({ ...prev, weight: e.target.value }))}
                                        />
                                    </label>
                                    <label className="form-label">
                                        Height (cm)
                                        <input
                                            className="form-input"
                                            type="number"
                                            value={editData.height}
                                            onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                                        />
                                    </label>
                                </>
                            )}

                            <button
                                className="page-button save-btn"
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving Changes..." : "Save Profile"}
                            </button>
                        </div>
                        
                        {message && (
                            <p className={`status-message ${isError ? "error-text" : "success-text"}`} style={{ marginTop: "15px", color: isError ? "#ef4444" : "#10b981" }}>
                                {message}
                            </p>
                        )}
                    </div>

                    {user.role === "doctor" && (
                        <section className="profile-section assigned-patients-section">
                            <h2 className="section-title">My Patients</h2>
                            {patients.length === 0 ? (
                                <p>No patients currently assigned to your dashboard.</p>
                            ) : (
                                <div className="table-card">
                                    {patients.map((patient) => (
                                        <div key={patient.id} className="table-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px", marginBottom: "15px" }}>
                                            <p><strong>{patient.name}</strong></p>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span><strong>Patient ID:</strong> <code>{patient.id}</code></span>
                                                <button
                                                    type="button"
                                                    className="page-button copy-btn"
                                                    style={{ padding: "2px 8px", fontSize: "12px", marginTop: 0 }}
                                                    onClick={() => copyToClipboard(String(patient.id))}
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <p>Age: {patient.age ?? "N/A"}</p>
                                            <p>Gender: {patient.gender ? (GENDER_LABELS[patient.gender] ?? "Unknown") : "Unknown"}</p>
                                            <p>Weight: {patient.weight ? `${patient.weight} kg` : "N/A"}</p>
                                            <p>Height: {patient.height ? `${patient.height} cm` : "N/A"}</p>

                                            <div className="patient-actions-row" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                                <button
                                                    className="page-button"
                                                    onClick={() => navigate(`/upload-prescription?profile=${patient.id}`)}
                                                >
                                                    Upload Prescription
                                                </button>
                                                <button
                                                    className="page-button"
                                                    onClick={() => navigate(`/prescriptions?profile=${patient.id}`)}
                                                >
                                                    View Prescriptions
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            ) : (
                <p>{message ?? "Profile records could not be found."}</p>
            )}
        </div>
    );
}