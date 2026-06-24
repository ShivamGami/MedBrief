from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import List, Optional


class MedicineBase(BaseModel):
    name: str
    brand_name: Optional[str] = None
    dosage_form: str
    strength: str
    description: Optional[str] = None


class MedicineRead(MedicineBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class PrescriptionMedicineCreate(BaseModel):
    name: str
    brand_name: Optional[str] = None
    dosage_form: str
    strength: str
    description: Optional[str] = None

    dosage_instructions: str
    duration: str
    end_date: Optional[datetime] = None


class BulkPrescriptionCreate(BaseModel):
    profile_id: UUID
    medicines: List[PrescriptionMedicineCreate]


class PrescriptionRead(BaseModel):
    id: UUID
    doctor_id: UUID
    profile_id: UUID

    medicine: MedicineRead

    dosage_instructions: str
    duration: str

    start_date: datetime
    end_date: Optional[datetime] = None

    is_active: bool

    model_config = ConfigDict(from_attributes=True)