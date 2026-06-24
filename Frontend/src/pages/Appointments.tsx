import { useContext, useEffect, useState } from "react";
import { API } from "../Config/Api";
import { AuthContext } from "../Context/AuthContext";
import type { Appointment, Doctor, Profile } from "../Config/Types";
import "../Css/Pages/Appointment.css";
const blankAppointment = {
    doctor_id: "",
    profile_id: "",
    start_time: "",
    end_time: "",
    status: "pending" as const,
    meeting_link: "",
    notes: "",
};

export default function Appointments() {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext.Provider is required.");

    const { user } = authContext;
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [record, setRecord] = useState<Doctor | Profile | null>(null);
    const [form, setForm] = useState(blankAppointment);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const data = await API<Doctor[]>("GET", "/personal/doctors");
                setDoctors(data);
            } catch (error) {
                setMessage("Unable to load doctors.");
            }
        };
        loadDoctors();
    }, []);

    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            try {
                const endpoint = user.role === "doctor"
                    ? `/personal/doctors/user/${user.id}`
                    : `/personal/profiles/user/${user.id}`;
                const data = await API<Doctor | Profile>("GET", endpoint);
                setRecord(data);

                if (user.role === "doctor") {
                    setForm(prev => ({ ...prev, doctor_id: data.id ?? prev.doctor_id }));
                } else {
                    setForm(prev => ({ ...prev, profile_id: data.id ?? prev.profile_id }));
                }
            } catch (error) {
                setMessage("Unable to load profile data for appointments.");
            }
        };

        loadProfile();
    }, [user]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const query = user?.role === "doctor"
                ? `?doctor_id=${record?.id ?? ""}`
                : record?.id ? `?profile_id=${record.id}` : "";
            const data = await API<Appointment[]>("GET", `/system/appointments${query}`);
            setAppointments(data);
        } catch (error) {
            setMessage("Unable to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && (user.role === "doctor" || record?.id)) {
            loadAppointments();
        }
    }, [user, record]);

    const handleChange = (field: keyof Appointment, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCreate = async () => {
        setMessage(null);
        if (!form.doctor_id || !form.profile_id || !form.start_time || !form.end_time) {
            setMessage("Doctor, profile, start and end time are required.");
            return;
        }

        setLoading(true);
        try {
            const data = await API<Appointment>("POST", "/system/appointments", {
                doctor_id: form.doctor_id,
                profile_id: form.profile_id,
                start_time: form.start_time,
                end_time: form.end_time,
            });
            setAppointments(prev => [data, ...prev]);
            setMessage("Appointment request submitted.");
        } catch (error) {
            setMessage("Could not create appointment.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (
        appointmentId: string,
        status: "approved" | "rejected"
    ) => {
        try {
            const updated = await API<Appointment>(
                "PATCH",
                `/system/appointments/${appointmentId}`,
                { status }
            );

            setAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentId ? updated : app
                )
            );
        } catch {
            setMessage("Failed to update appointment.");
        }
    };

    return (
        <div className="appointments-wrapper-root">
            <div className="page-content">
                <h1 className="page-title">Appointments</h1>
                
                <div className="appointments-card">
                    <h2 className="section-title">Book appointment</h2>
                    <div className="form-grid">
                        <label className="form-label">
                            Doctor
                            <select
                                className="form-input"
                                value={form.doctor_id}
                                onChange={e => handleChange("doctor_id", e.target.value)}
                            >
                                <option value="">Select doctor</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>{doc.name ?? "Doctor"}</option>
                                ))}
                            </select>
                        </label>

                        <label className="form-label">
                            Start time
                            <input
                                className="form-input"
                                type="datetime-local"
                                value={form.start_time ?? ""}
                                onChange={e => handleChange("start_time", e.target.value)}
                            />
                        </label>
                        <label className="form-label">
                            End time
                            <input
                                className="form-input"
                                type="datetime-local"
                                value={form.end_time ?? ""}
                                onChange={e => handleChange("end_time", e.target.value)}
                            />
                        </label>
                    </div>
                    <button type="button" className="page-button" onClick={handleCreate} disabled={loading}>
                        {loading ? "Saving…" : "Request Appointment"}
                    </button>
                    {message && <p className="page-message">{message}</p>}
                </div>

                <section className="appointments-list">
                    <h2 className="section-title">Appointments</h2>
                    {loading ? (
                        <p>Loading appointments…</p>
                    ) : appointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        <div className="table-card">
                            {appointments.map(app => (
                                <div key={app.id} className="table-row">
                                    <p><strong>{app.status}</strong></p>

                                    <p>{new Date(app.start_time ?? "").toLocaleString()}</p>

                                    <p>to</p>

                                    <p>{new Date(app.end_time ?? "").toLocaleString()}</p>

                                    <p>{app.notes ?? ""}</p>

                                    {user?.role === "doctor" && app.status === "pending" && (
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button
                                                className="page-button"
                                                onClick={() => app.id && updateStatus(app.id, "approved")}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="page-button btn-reject"
                                                onClick={() => app.id && updateStatus(app.id, "rejected")}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}