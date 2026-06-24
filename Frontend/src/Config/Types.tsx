export interface User {
    id: string;
    username: string;
    email: string;
    role: "doctor" | "patient";
    is_active: boolean;
}

export interface Auth {
    email: string | null;
    password: string | null;
    role: "doctor" | "patient";
}

export interface Tokens {
    access: string;
    refresh: string;
}

export interface HealthData {
    id?: string;

    ldl_cholesterol: number;
    hdl_cholesterol: number;
    triglycerides: number;

    hba1c: number;
    fasting_glucose: number;

    haemoglobin: number;
    wbc_count: number;
    platelet_count: number;

    alt_ast: number;
    egfr: number;

    resting_heart_rate: number;
    blood_pressure: string;
    spo2: number;

    created_at?: string;
    uploaded_by?: string;
    pdf_path?: string;
    analysis?: {
        cardiac_risk_score: string | null;
        metabolic_status: string | null;
        kidney_status: string | null;
        ai_summary: string | null;
    } | null;
}

export interface MedicalAnalysis {
    cardiac_risk_score: string | null;
    metabolic_status: string | null;
    kidney_status: string | null;
    ai_summary: string | null;
}

export interface Medicine {
    id?: number;

    name: string;
    brand_name?: string | null;

    dosage_form: string;
    strength: string;

    description?: string | null;
}

export interface Prescription {
    id?: string;

    doctor_id?: string;
    profile_id?: string;

    medicine: Medicine;

    dosage_instructions: string;
    duration: string;

    start_date?: string;
    end_date?: string | null;

    is_active: boolean;
}

export interface Doctor {
    id?: string;

    user_id?: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    specialization: string;
    license_number: string | null;
}

export interface Profile {
    id?: string;

    user_id?: string;
    doctor_id?: string | null;
    name: string | null;
    age: number | null;
    gender: number | null;
    weight: number | null;
    height: number | null;
}

export interface Appointment {
    id?: string;

    doctor_id: string;
    profile_id: string;

    start_time: string | null;
    end_time: string | null;

    status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "cancelled";

    meeting_link: string | null;
    notes: string | null;
}

export interface ChatMessage {
    id?: string;

    user_query: string;
    ai_response: string;

    session_id: string;
    chat_mode: "gemini" | "doctor";

    created_at?: string;
}

export interface ChatSessionResponse {
    session_id: string;
    messages: ChatMessage[];
}