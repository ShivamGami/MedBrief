import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Float, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..DataBase import Base

class HealthData(Base):
    __tablename__ = 'health_reports'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("auth_users.id"))
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("auth_users.id"), nullable=False)
    pdf_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    owner = relationship("Auth_User", back_populates="health_reports", foreign_keys=[user_id])
    uploaded_by_user = relationship("Auth_User", foreign_keys=[uploaded_by])
    
    ldl_cholesterol = Column(Float)
    hdl_cholesterol = Column(Float)
    triglycerides = Column(Float)
    
    hba1c = Column(Float)
    fasting_glucose = Column(Float)
    
    haemoglobin = Column(Float)
    wbc_count = Column(Integer)
    platelet_count = Column(Integer)
    
    alt_ast = Column(Float)
    egfr = Column(Float)
    
    resting_heart_rate = Column(Integer)
    blood_pressure = Column(String)
    spo2 = Column(Float)

    analysis = relationship("MedicalAnalysis", back_populates="report", uselist=False)


class MedicalAnalysis(Base):
    __tablename__ = "medical_analysis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("health_reports.id"), nullable=False)
    
    cardiac_risk_score = Column(String)
    metabolic_status = Column(String)
    kidney_status = Column(String)
    ai_summary = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=func.now())

    report = relationship("HealthData", back_populates="analysis")