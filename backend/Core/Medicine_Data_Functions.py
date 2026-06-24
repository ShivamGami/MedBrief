from sqlalchemy.orm import Session
from uuid import UUID
from ..Models.Medicine_Data import Medicine, Prescription

def create_prescription(
    db: Session,
    profile_id : UUID,
    doctor_id : UUID,
    medicines : list[dict]
) -> list[Prescription]:
    db.query(Prescription).filter(
        Prescription.profile_id == profile_id,
        Prescription.is_active == True
    ).update({"is_active" : False})

    new_prescription = []

    for item in medicines:
    
        medicine = get_or_create_medicine(
            db,
            {
                "name": item["name"],
                "brand_name": item.get("brand_name"),
                "dosage_form": item["dosage_form"],
                "strength": item["strength"],
                "description": item.get("description"),
            }
        )
    
        prescription = Prescription(
            doctor_id=doctor_id,
            profile_id=profile_id,
            medicine_id=medicine.id,
                dosage_instructions=item["dosage_instructions"],
                duration=item["duration"],
                end_date=item.get("end_date", None),
                is_active=True
        )
        new_prescription.append(prescription)
        db.add(prescription)

    db.commit()
    return new_prescription

def get_or_create_medicine(
    db: Session,
    medicine_data: dict
) -> Medicine:

    existing = db.query(Medicine).filter(
        Medicine.name == medicine_data["name"]
    ).first()

    if existing:
        return existing

    new_medicine = Medicine(
        name=medicine_data["name"],
        brand_name=medicine_data.get("brand_name"),
        dosage_form=medicine_data["dosage_form"],
        strength=medicine_data["strength"],
        description=medicine_data.get("description"),
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return new_medicine

    
def get_active_prescription(
    db: Session,
    profile_id: UUID
) -> list[Prescription]:
    return db.query(Prescription).filter(
        Prescription.profile_id == profile_id,
        Prescription.is_active == True
    ).all()


def get_all_prescriptions(
    db: Session,
    profile_id: UUID
) -> list[Prescription]:
    return db.query(Prescription).filter(
        Prescription.profile_id == profile_id
    ).order_by(Prescription.start_date.desc()).all()


def get_prescription_by_id(
    db: Session,
    prescription_id: UUID
) -> Prescription | None:
    return db.query(Prescription).filter(Prescription.id == prescription_id).first()