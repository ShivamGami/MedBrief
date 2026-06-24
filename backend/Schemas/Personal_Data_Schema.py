from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from typing import Optional
from enum import IntEnum

class GenderEnum(IntEnum):
    MALE = 1
    FEMALE = 2
    OTHER = 3

class DoctorCreate(BaseModel):
    user_id: UUID
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    specialization: str
    license_number: str

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    license_number: Optional[str] = None

class DoctorResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    specialization: str
    license_number: str


class ProfileCreate(BaseModel):
    user_id: UUID
    doctor_id: Optional[UUID] = None
    name: str
    age: int = Field(..., gt=0, lt=150)
    gender: GenderEnum
    weight: int = Field(..., gt=0, description="Weight in kg")
    height: int = Field(..., gt=0, description="Height in cm")

class ProfileUpdate(BaseModel):
    doctor_id: Optional[UUID] = None
    name: Optional[str] = None
    age: Optional[int] = Field(None, gt=0, lt=150)
    gender: Optional[GenderEnum] = None
    weight: Optional[int] = Field(None, gt=0)
    height: Optional[int] = Field(None, gt=0)

class ProfileResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    user_id: UUID
    doctor_id: Optional[UUID] = None
    name: str
    age: int
    gender: GenderEnum
    weight: int
    height: int
