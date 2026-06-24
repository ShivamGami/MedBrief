from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from ..Core.Personal_Data_functions import (
    get_doctor_by_user_id,
    get_profile_by_user_id,
)
from ..DataBase.Database import get_db
from ..Security.Dependencies import get_current_user
from ..Schemas.Medicine_Data_Schema import BulkPrescriptionCreate, PrescriptionRead
from ..Core.Medicine_Data_Functions import (
    create_prescription,
    get_active_prescription,
    get_all_prescriptions,
    get_prescription_by_id
)

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])


@router.post("/uploadprescription", response_model=list[PrescriptionRead], status_code=status.HTTP_201_CREATED)
def upload_prescription(
    data: BulkPrescriptionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can upload prescriptions."
        )

    doctor = get_doctor_by_user_id(db, current_user.id)

    prescriptions = create_prescription(
        db=db,
        profile_id=data.profile_id,
        doctor_id=doctor.id,
        medicines=[m.model_dump() for m in data.medicines]
    )

    return prescriptions


@router.get("/active/{profile_id}", response_model=list[PrescriptionRead])
def active_prescriptions(
    profile_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_active_prescription(db, profile_id)


@router.get("/history/{profile_id}", response_model=list[PrescriptionRead])
def prescription_history(
    profile_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_all_prescriptions(db, profile_id)


@router.get("/my-active", response_model=list[PrescriptionRead])
def my_active_prescriptions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = get_profile_by_user_id(db, current_user.id)

    return get_active_prescription(
        db,
        profile.id
    )


@router.get("/my-history", response_model=list[PrescriptionRead])
def my_history_prescriptions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = get_profile_by_user_id(db, current_user.id)

    return get_all_prescriptions(
        db,
        profile.id
    )


@router.get("/{prescription_id}", response_model=PrescriptionRead)
def get_prescription(
    prescription_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    prescription = get_prescription_by_id(db, prescription_id)

    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prescription not found."
        )

    if current_user.role != "doctor" and prescription.profile_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this prescription."
        )

    return prescription


