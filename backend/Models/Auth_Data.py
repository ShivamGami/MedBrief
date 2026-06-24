import enum
import uuid
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..DataBase import Base

class UserRole(enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"

class Auth_User(Base):
    __tablename__ = "auth_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False, index=True)
    
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    role = Column(String, default="patient")

    profile = relationship("Profile", back_populates="owner", uselist=False)
    chat_history = relationship("ChatMessage", back_populates="owner", uselist=True)
    health_reports = relationship(
        "HealthData",
        back_populates="owner",
        uselist=True,
        foreign_keys="HealthData.user_id",
    )