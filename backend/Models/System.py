from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Float, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship 
from ..DataBase import Base
import uuid

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("Profile.id"), nullable=False)
    
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String, default="pending")
    meeting_link = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    doctor = relationship("Doctor", back_populates="appointments")
    profile = relationship("Profile", back_populates="appointments")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("auth_users.id"), nullable=False)
    
    user_query = Column(String, nullable=False)
    ai_response = Column(String, nullable=False)
    chat_mode = Column(String, nullable=False, default="gemini")
    timestamp = Column(DateTime, default=func.now())
    session_id = Column(UUID(as_uuid=True), index=True)

    owner = relationship("Auth_User", back_populates="chat_history")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("auth_users.id"), nullable=False)
    target_profile_id = Column(UUID(as_uuid=True), ForeignKey("Profile.id"), nullable=False)
    action = Column(String, nullable=False)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

    actor = relationship("Auth_User")
    target_profile = relationship("Profile")
