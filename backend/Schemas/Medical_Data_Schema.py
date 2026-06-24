from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional


class HealthDataBase(BaseModel):
    ldl_cholesterol: Optional[float] = Field(None, ge=0, description="mg/dL")
    hdl_cholesterol: Optional[float] = Field(None, ge=0, description="mg/dL")
    triglycerides: Optional[float] = Field(None, ge=0, description="mg/dL")
    hba1c: Optional[float] = Field(None, ge=0, le=20, description="Percentage %")
    fasting_glucose: Optional[float] = Field(None, ge=0, description="mg/dL")
    haemoglobin: Optional[float] = Field(None, ge=0)
    wbc_count: Optional[int] = Field(None, ge=0)
    platelet_count: Optional[int] = Field(None, ge=0)
    alt_ast: Optional[float] = None
    egfr: Optional[float] = Field(None, description="mL/min/1.73m2")
    resting_heart_rate: Optional[int] = Field(None, ge=30, le=250)
    blood_pressure: Optional[str] = Field(None, pattern=r"^\d{2,3}/\d{2,3}$", example="120/80")
    spo2: Optional[float] = Field(None, ge=0, le=100)


class HealthDataCreate(HealthDataBase):
    pass


class MedicalAnalysisBase(BaseModel):
    cardiac_risk_score: Optional[str] = None
    metabolic_status: Optional[str] = None
    kidney_status: Optional[str] = None
    ai_summary: Optional[str] = None


class MedicalAnalysisCreate(MedicalAnalysisBase):
    report_id: UUID


class MedicalAnalysisRead(MedicalAnalysisBase):
    id: UUID
    report_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HealthDataRead(HealthDataBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    uploaded_by: Optional[UUID] = None
    pdf_path: Optional[str] = None
    analysis: Optional[MedicalAnalysisRead] = None

    model_config = ConfigDict(from_attributes=True)