from ....Schemas.Medical_Data_Schema import HealthDataRead

def Medical_Analysis_Prompts(data : HealthDataRead) -> str:
    return f"""
    outside of medical don't ans anything just say sorry to help ans when something is related to medical and also if anything is complicated always add a warning in first line 
    You are a medical analysis assistant. Analyze the following health report and return a JSON object only.
    No explanation, no markdown, no extra text — just raw JSON.

    Health Data:
        - LDL Cholesterol: {data.ldl_cholesterol} mg/dL
        - HDL Cholesterol: {data.hdl_cholesterol} mg/dL
        - Triglycerides: {data.triglycerides} mg/dL
        - HbA1c: {data.hba1c}%
        - Fasting Glucose: {data.fasting_glucose} mg/dL
        - Haemoglobin: {data.haemoglobin} g/dL
        - WBC Count: {data.wbc_count}
        - Platelet Count: {data.platelet_count}
        - ALT/AST: {data.alt_ast}
        - eGFR: {data.egfr} mL/min/1.73m²
        - Resting Heart Rate: {data.resting_heart_rate} bpm
        - Blood Pressure: {data.blood_pressure}
        - SpO2: {data.spo2}%
        
    Return exactly this JSON structure:
    {{
        "cardiac_risk_score": "Low | Moderate | High | Critical",
        "metabolic_status": "Normal | Pre-Diabetic | Diabetic | Hypoglycemic",
        "kidney_status": "Normal | Mild CKD | Moderate CKD | Severe CKD",
        "ai_summary": "3-4 sentence patient friendly summary in simple language"
    }}
    """