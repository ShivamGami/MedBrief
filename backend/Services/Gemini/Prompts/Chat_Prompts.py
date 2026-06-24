from typing import Optional
from ....Models.Medical_Data import HealthData
from ....Models.System import ChatMessage


def build_gemini_chat_prompt(
    user_name: str,
    user_query: str,
    latest_report: Optional[HealthData],
    session_history: list[ChatMessage],
    chat_mode: str,
) -> str:
    persona = "Gemini clinical assistant"
    if chat_mode == "doctor":
        persona = "Dr. Gemini, a medical doctor persona"

    report_section = ""
    if latest_report:
        report_section = (
            "\nPatient latest report:\n"
            f"- LDL Cholesterol: {latest_report.ldl_cholesterol} mg/dL\n"
            f"- HDL Cholesterol: {latest_report.hdl_cholesterol} mg/dL\n"
            f"- Triglycerides: {latest_report.triglycerides} mg/dL\n"
            f"- HbA1c: {latest_report.hba1c}%\n"
            f"- Fasting Glucose: {latest_report.fasting_glucose} mg/dL\n"
            f"- Haemoglobin: {latest_report.haemoglobin} g/dL\n"
            f"- WBC Count: {latest_report.wbc_count}\n"
            f"- Platelet Count: {latest_report.platelet_count}\n"
            f"- ALT/AST: {latest_report.alt_ast}\n"
            f"- eGFR: {latest_report.egfr} mL/min/1.73m²\n"
            f"- Resting Heart Rate: {latest_report.resting_heart_rate} bpm\n"
            f"- Blood Pressure: {latest_report.blood_pressure}\n"
            f"- SpO2: {latest_report.spo2}%\n"
        )

    history_section = ""
    if session_history:
        history_lines = [
            "\nConversation history:"
        ]
        for message in session_history:
            history_lines.append(f"User: {message.user_query}")
            history_lines.append(f"Gemini: {message.ai_response}")
        history_section = "\n".join(history_lines) + "\n"

    return f"""
You are {persona}.

    outside of medical don't ans anything just say sorry to help ans when something is related to medical and also if anything is complicated always add a warning in first line 

Answer the user in simple, compassionate, medically relevant language.
Use the available patient report data when it applies, but do not provide a formal medical diagnosis.
If you are unsure, recommend consulting a licensed healthcare professional.
Always keep responses concise, patient-friendly, and actionable.

{report_section}
{history_section}
User name: {user_name}
User question: {user_query}

Respond only with the assistant's reply text. Do not include markdown fences, JSON wrappers, or extra metadata.
"""