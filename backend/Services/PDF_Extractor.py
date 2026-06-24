import pdfplumber
import re
from io import BytesIO
from typing import Optional

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def _find_float(patterns: list[str], text: str) -> Optional[float]:
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                continue
    return None


def _find_int(patterns: list[str], text: str) -> Optional[int]:
    val = _find_float(patterns, text)
    return int(val) if val is not None else None


def _find_bp(text: str) -> Optional[str]:
    match = re.search(r"Blood\s*Pressure[\s:]+(\d{2,3}/\d{2,3})", text, re.IGNORECASE)
    if not match:
        match = re.search(r"\b(\d{2,3}/\d{2,3}\s*mmhg)", text, re.IGNORECASE)
    return match.group(1) if match else None


def parse_health_fields(text: str) -> dict:
    return {
        "ldl_cholesterol": _find_float([
            r"LDL[\s\-]*Cholesterol[\s:]+(\d+\.?\d*)",
            r"LDL[\s:]+(\d+\.?\d*)",
            r"Low\s+Density\s+Lipoprotein[\s:]+(\d+\.?\d*)",
        ], text),

        "hdl_cholesterol": _find_float([
            r"HDL[\s\-]*Cholesterol[\s:]+(\d+\.?\d*)",
            r"HDL[\s:]+(\d+\.?\d*)",
            r"High\s+Density\s+Lipoprotein[\s:]+(\d+\.?\d*)",
        ], text),

        "triglycerides": _find_float([
            r"Triglycerides?[\s:]+(\d+\.?\d*)",
            r"TG[\s:]+(\d+\.?\d*)",
        ], text),

        "hba1c": _find_float([
            r"HbA1c[\s:]+(\d+\.?\d*)",
            r"Glycated\s+Hae?moglobin[\s:]+(\d+\.?\d*)",
            r"Glycohaemoglobin[\s:]+(\d+\.?\d*)",
        ], text),

        "fasting_glucose": _find_float([
            r"Fasting[\s\-]*Glucose[\s:]+(\d+\.?\d*)",
            r"Blood\s+Glucose[\s\-]*Fasting[\s:]+(\d+\.?\d*)",
            r"FBS[\s:]+(\d+\.?\d*)",
            r"F\.?\s*Blood\s+Sugar[\s:]+(\d+\.?\d*)",
        ], text),

        "haemoglobin": _find_float([
            r"Hae?moglobin[\s:]+(\d+\.?\d*)",
            r"\bHb[\s:]+(\d+\.?\d*)",
            r"\bHGB[\s:]+(\d+\.?\d*)",
        ], text),

        "wbc_count": _find_int([
            r"WBC[\s\-]*Count[\s:]+(\d+\.?\d*)",
            r"White\s+Blood\s+Cell[\s\-]*Count[\s:]+(\d+\.?\d*)",
            r"\bTLC[\s:]+(\d+\.?\d*)",
        ], text),

        "platelet_count": _find_int([
            r"Platelet[\s\-]*Count[\s:]+(\d+\.?\d*)",
            r"\bPLT[\s:]+(\d+\.?\d*)",
        ], text),

        "alt_ast": _find_float([
            r"ALT[\s:]+(\d+\.?\d*)",
            r"SGPT[\s:]+(\d+\.?\d*)",
            r"Alanine\s+Aminotransferase[\s:]+(\d+\.?\d*)",
        ], text),

        "egfr": _find_float([
            r"eGFR[\s:]+(\d+\.?\d*)",
            r"Estimated\s+GFR[\s:]+(\d+\.?\d*)",
        ], text),

        "resting_heart_rate": _find_int([
            r"(?:Resting\s+)?Heart\s+Rate[\s:]+(\d+)",
            r"Pulse\s+Rate[\s:]+(\d+)",
            r"\bPR[\s:]+(\d+)\s*bpm",
        ], text),

        "blood_pressure": _find_bp(text),

        "spo2": _find_float([
            r"SpO2[\s:]+(\d+\.?\d*)",
            r"Oxygen\s+Saturation[\s:]+(\d+\.?\d*)",
        ], text),
    }