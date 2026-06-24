import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../Config/Api";
import "../Css/Pages/Upload_prescription.css";

export default function UploadPrescription() {
    const [searchParams] = useSearchParams();

    const [profileId, setProfileId] = useState(
        searchParams.get("profile") || ""
    );

    const [medicine, setMedicine] = useState({
        name: "",
        brand_name: "",
        dosage_form: "",
        strength: "",
        description: "",
        dosage_instructions: "",
        duration: "",
        end_date: "",
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async () => {
        if (!profileId || !medicine.name) {
            setIsError(true);
            setMessage("Patient Profile ID and Medicine Name are required fields.");
            return;
        }

        try {
            await API("POST", "/prescriptions/uploadprescription", {
                profile_id: profileId,
                medicines: [medicine],
            });

            setIsError(false);
            setMessage("Prescription uploaded successfully.");

            setMedicine({
                name: "",
                brand_name: "",
                dosage_form: "",
                strength: "",
                description: "",
                dosage_instructions: "",
                duration: "",
                end_date: "",
            });
        } catch (error) {
            setIsError(true);
            setMessage("Failed to upload prescription.");
        }
    };

    return (
        <div className="prescriptionPageWrapper">
            <h1 className="prescriptionPageTitle">Upload Prescription</h1>

            <div className="prescriptionCardContainer">
                <div className="prescriptionFormGrid">
                    
                    <div className="prescriptionFormGroup">
                        <label className="prescriptionFormLabel">Patient Profile ID</label>
                        <input
                            className="prescriptionFormInput"
                            placeholder="Enter unique profile alphanumeric key"
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value)}
                        />
                    </div>

                    <div className="prescriptionFormRowTwoCol">
                        <div className="prescriptionFormGroup">
                            <label className="prescriptionFormLabel">Medicine Name</label>
                            <input
                                className="prescriptionFormInput"
                                placeholder="e.g. Paracetamol"
                                value={medicine.name}
                                onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
                            />
                        </div>

                        <div className="prescriptionFormGroup">
                            <label className="prescriptionFormLabel">Brand Name</label>
                            <input
                                className="prescriptionFormInput"
                                placeholder="e.g. Calpol"
                                value={medicine.brand_name}
                                onChange={(e) => setMedicine({ ...medicine, brand_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="prescriptionFormRowTwoCol">
                        <div className="prescriptionFormGroup">
                            <label className="prescriptionFormLabel">Dosage Form</label>
                            <input
                                className="prescriptionFormInput"
                                placeholder="e.g. Tablet / Syrup / Injection"
                                value={medicine.dosage_form}
                                onChange={(e) => setMedicine({ ...medicine, dosage_form: e.target.value })}
                            />
                        </div>

                        <div className="prescriptionFormGroup">
                            <label className="prescriptionFormLabel">Strength</label>
                            <input
                                className="prescriptionFormInput"
                                placeholder="e.g. 500mg"
                                value={medicine.strength}
                                onChange={(e) => setMedicine({ ...medicine, strength: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="prescriptionFormGroup">
                        <label className="prescriptionFormLabel">Dosage Instructions</label>
                        <input
                            className="prescriptionFormInput"
                            placeholder="e.g. Twice a day after meals"
                            value={medicine.dosage_instructions}
                            onChange={(e) => setMedicine({ ...medicine, dosage_instructions: e.target.value })}
                        />
                    </div>

                    <div className="prescriptionFormRowTwoCol">
                        <div className="prescriptionFormGroup">
                            <label className="prescriptionFormLabel">Duration per Day</label>
                            <input
                                className="prescriptionFormInput"
                                placeholder="e.g. 1 morning, 1 night"
                                value={medicine.duration}
                                onChange={(e) => setMedicine({ ...medicine, duration: e.target.value })}
                            />
                        </div>

                        <div className="prescriptionFormGroup">
                            <label className="prescriptionFormLabel">Treatment End Date</label>
                            <input
                                className="prescriptionFormInput"
                                type="date"
                                value={medicine.end_date}
                                onChange={(e) => setMedicine({ ...medicine, end_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="prescriptionSubmitBtn" onClick={handleSubmit}>
                        Upload Prescription
                    </button>

                    {message && (
                        <div className={`prescriptionStatusBanner ${isError ? "prescriptionStatusError" : "prescriptionStatusSuccess"}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}