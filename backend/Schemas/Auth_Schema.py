from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional

class SignupRequest(BaseModel):
    email: EmailStr 
    password: str
    role: str = "patient"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        normalized = v.strip().lower()
        if normalized not in {"doctor", "patient"}:
            raise ValueError("Role must be either 'doctor' or 'patient'")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: Optional[datetime] = None

class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., description="The refresh token provided during login")

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    is_active: bool = True
    
    model_config = ConfigDict(from_attributes=True)