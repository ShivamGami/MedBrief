import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship 
from ..DataBase import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    brand_name = Column(String, nullable=True)
    dosage_form = Column(String)
    strength = Column(String)
    description = Column(String, nullable=True)

    prescriptions = relationship("Prescription", back_populates="medicine")

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("Profile.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    
    dosage_instructions = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    start_date = Column(DateTime, server_default=func.now())
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    doctor = relationship("Doctor", back_populates="prescriptions")
    profile = relationship("Profile")
    medicine = relationship("Medicine", back_populates="prescriptions")