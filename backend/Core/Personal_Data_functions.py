from uuid import UUID
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from ..Models.Personal_Data import Profile, Doctor
from ..Schemas.Personal_Data_Schema import (
    ProfileCreate,
    ProfileUpdate,
    DoctorCreate,
    DoctorUpdate,
)


# ── Doctor ────────────────────────────────────────────────────────────────────

def create_doctor(db: Session, data: DoctorCreate) -> Doctor:
    existing_license = db.query(Doctor).filter(Doctor.license_number == data.license_number).first()
    if existing_license:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="License number already registered")

    if data.email:
        existing_email = db.query(Doctor).filter(Doctor.email == data.email).first()
        if existing_email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Doctor email already registered")

    if data.phone:
        existing_phone = db.query(Doctor).filter(Doctor.phone == data.phone).first()
        if existing_phone:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Doctor phone already registered")

    doctor = Doctor(**data.model_dump())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor


def get_doctor_by_id(db: Session, doctor_id: UUID) -> Doctor:
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return doctor


def get_doctor_by_user_id(db: Session, user_id: UUID) -> Doctor:
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return doctor


def list_doctors(db: Session) -> List[Doctor]:
    return db.query(Doctor).all()


def update_doctor(db: Session, doctor_id: UUID, data: DoctorUpdate) -> Doctor:
    doctor = get_doctor_by_id(db, doctor_id)
    update_data = data.model_dump(exclude_none=True)

    if "license_number" in update_data:
        conflict = (
            db.query(Doctor)
            .filter(Doctor.license_number == update_data["license_number"], Doctor.id != doctor_id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="License number already registered")

    if "email" in update_data and update_data["email"] is not None:
        conflict = (
            db.query(Doctor)
            .filter(Doctor.email == update_data["email"], Doctor.id != doctor_id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Doctor email already registered")

    if "phone" in update_data and update_data["phone"] is not None:
        conflict = (
            db.query(Doctor)
            .filter(Doctor.phone == update_data["phone"], Doctor.id != doctor_id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Doctor phone already registered")

    for field, value in update_data.items():
        setattr(doctor, field, value)
    db.commit()
    db.refresh(doctor)
    return doctor


def delete_doctor(db: Session, doctor_id: UUID) -> dict:
    doctor = get_doctor_by_id(db, doctor_id)
    db.delete(doctor)
    db.commit()
    return {"detail": "Doctor deleted successfully"}


# ── patient ───────────────────────────────────────────────────────────────────

def create_profile(db: Session, data: ProfileCreate) -> Profile:
    existing = db.query(Profile).filter(Profile.user_id == data.user_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profile already exists for this user")
    profile = Profile(**data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_profile_by_id(db: Session, profile_id: UUID) -> Profile:
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile


def get_profile_by_user_id(db: Session, user_id: UUID) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile


def get_profiles_by_doctor(db: Session, doctor_id: UUID) -> List[Profile]:
    return db.query(Profile).filter(Profile.doctor_id == doctor_id).all()


def list_profiles(db: Session) -> List[Profile]:
    return db.query(Profile).all()


def update_profile(db: Session, profile_id: UUID, data: ProfileUpdate) -> Profile:
    profile = get_profile_by_id(db, profile_id)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


def delete_profile(db: Session, profile_id: UUID) -> dict:
    profile = get_profile_by_id(db, profile_id)
    db.delete(profile)
    db.commit()
    return {"detail": "Profile deleted successfully"}



def get_my_doctor(db: Session, user_id: UUID) -> Doctor:
    profile = get_profile_by_user_id(db, user_id)

    if not profile.doctor_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No doctor assigned"
        )

    return get_doctor_by_id(db, profile.doctor_id)


def assign_patient_to_doctor(
    db: Session,
    doctor_user_id: UUID,
    profile_id: UUID
) -> Profile:

    doctor = get_doctor_by_user_id(db, doctor_user_id)

    profile = get_profile_by_id(db, profile_id)

    profile.doctor_id = doctor.id

    db.commit()
    db.refresh(profile)

    return profile