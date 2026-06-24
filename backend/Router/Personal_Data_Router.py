from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from ..Security.Dependencies import get_current_user
from ..DataBase.Database import get_db
from ..Schemas.Personal_Data_Schema import (
    DoctorCreate,
    DoctorUpdate,
    DoctorResponse,
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse,
)
from ..Core.Personal_Data_functions import (
    create_doctor,
    get_doctor_by_id,
    get_doctor_by_user_id,
    list_doctors,
    update_doctor,
    delete_doctor,
    create_profile,
    get_profile_by_id,
    get_profile_by_user_id,
    get_profiles_by_doctor,
    list_profiles,
    update_profile,
    delete_profile,
    get_my_doctor,
    assign_patient_to_doctor,
)

router = APIRouter(prefix="/personal", tags=["Personal Data"])

@router.post("/doctors", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor_route(payload: DoctorCreate, db: Session = Depends(get_db)):
    return create_doctor(db, payload)


@router.get("/doctors", response_model=List[DoctorResponse])
def list_doctors_route(db: Session = Depends(get_db)):
    return list_doctors(db)


@router.get("/doctors/{doctor_id}", response_model=DoctorResponse)
def read_doctor(doctor_id: UUID, db: Session = Depends(get_db)):
    return get_doctor_by_id(db, doctor_id)


@router.get("/doctors/user/{user_id}", response_model=DoctorResponse)
def read_doctor_by_user(user_id: UUID, db: Session = Depends(get_db)):
    return get_doctor_by_user_id(db, user_id)


@router.get("/doctors/{doctor_id}/patients", response_model=List[ProfileResponse])
def read_doctor_patients(doctor_id: UUID, db: Session = Depends(get_db)):
    # Verify doctor exists first
    doctor = get_doctor_by_id(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile records not found.")
    return get_profiles_by_doctor(db, doctor_id)


@router.put("/doctors/{doctor_id}", response_model=DoctorResponse)
def update_doctor_route(doctor_id: UUID, payload: DoctorUpdate, db: Session = Depends(get_db)):
    return update_doctor(db, doctor_id, payload)


@router.delete("/doctors/{doctor_id}")
def delete_doctor_route(doctor_id: UUID, db: Session = Depends(get_db)):
    return delete_doctor(db, doctor_id)


# --- PATIENT PROFILE MANAGEMENT ROUTES ---

@router.post("/profiles", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile_route(payload: ProfileCreate, db: Session = Depends(get_db)):
    return create_profile(db, payload)


@router.get("/profiles", response_model=List[ProfileResponse])
def list_profiles_route(db: Session = Depends(get_db)):
    return list_profiles(db)


@router.get("/profiles/{profile_id}", response_model=ProfileResponse)
def read_profile(profile_id: UUID, db: Session = Depends(get_db)):
    return get_profile_by_id(db, profile_id)


@router.get("/profiles/user/{user_id}", response_model=ProfileResponse)
def read_profile_by_user(user_id: UUID, db: Session = Depends(get_db)):
    return get_profile_by_user_id(db, user_id)


@router.get("/profiles/doctor/{doctor_id}", response_model=List[ProfileResponse])
def read_profiles_by_doctor(doctor_id: UUID, db: Session = Depends(get_db)):
    return get_profiles_by_doctor(db, doctor_id)


@router.put("/profiles/{profile_id}", response_model=ProfileResponse)
def update_profile_route(profile_id: UUID, payload: ProfileUpdate, db: Session = Depends(get_db)):
    return update_profile(db, profile_id, payload)


@router.delete("/profiles/{profile_id}")
def delete_profile_route(profile_id: UUID, db: Session = Depends(get_db)):
    return delete_profile(db, profile_id)



@router.get("/my-doctor", response_model=DoctorResponse)
def my_doctor_route(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if getattr(current_user, "role", None) == "doctor":
        raise HTTPException(status_code=400, detail="Doctors cannot search for their own doctor assignment profile.")
    return get_my_doctor(db, current_user.id)


@router.post("/assign-patient/{profile_id}")
def assign_patient(
    profile_id: UUID,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if getattr(current_user, "role", None) != "doctor":
        raise HTTPException(status_code=43, detail="Only verified doctors can link patient profiles.")
    return assign_patient_to_doctor(db, current_user.id, profile_id)


@router.get("/my-patients", response_model=List[ProfileResponse])
def my_patients(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if getattr(current_user, "role", None) != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access Denied: This dashboard view is restricted to medical doctor accounts only."
        )

    doctor = get_doctor_by_user_id(db, current_user.id)
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Your account is set to 'doctor' but no matching profile metadata exists."
        )

    return get_profiles_by_doctor(db, doctor.id)