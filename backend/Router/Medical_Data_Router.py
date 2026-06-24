from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from pathlib import Path
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from ..DataBase.Database import get_db
from ..Models.Medical_Data import HealthData
from ..Schemas.Medical_Data_Schema import HealthDataCreate, HealthDataRead
from ..Services.PDF_Extractor import extract_text_from_pdf, parse_health_fields
from ..Security.Dependencies import get_current_user
from ..Services.Gemini.Analysis_Services import Analysis_And_Save

UPLOAD_ROOT = Path(__file__).resolve().parents[1] / "uploads" / "reports"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)


router = APIRouter(prefix="/reports", tags=["Health Reports"])

MAX_PDF_SIZE_MB = 10


@router.post("/upload",response_model=HealthDataRead,status_code=status.HTTP_201_CREATED)
async def upload_health_reports(file: UploadFile = File(...),patient_id: UUID | None = None,db: Session = Depends(get_db),current_user=Depends(get_current_user),):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are accepted."
        )

    pdf_bytes = await file.read()

    if len(pdf_bytes) > MAX_PDF_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size is {MAX_PDF_SIZE_MB}MB."
        )

    if current_user.role == "doctor" and not patient_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="patient_id is required for doctor uploads."
        )

    pdf_filename = f"{uuid4()}.pdf"
    saved_pdf_path = UPLOAD_ROOT / pdf_filename

    try:
        saved_pdf_path.write_bytes(pdf_bytes)

        text = extract_text_from_pdf(pdf_bytes)

        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract any text from this PDF."
            )

        raw_fields = parse_health_fields(text)

        try:
            health_input = HealthDataCreate(**raw_fields)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Extracted data failed validation: {str(e)}"
            )

        target_user_id = (
            patient_id
            if current_user.role == "doctor"
            else current_user.id
        )

        report = HealthData(
            user_id=target_user_id,
            uploaded_by=current_user.id,
            **health_input.model_dump()
        )

        db.add(report)
        db.commit()
        db.refresh(report)

        report_schema = HealthDataRead.model_validate(report)

        try:
            await Analysis_And_Save(report_schema, db)
        except Exception as e:
            print(f"Analysis failed: {e}")

        return report

    finally:
        try:
            saved_pdf_path.unlink(missing_ok=True)
        except Exception:
            pass


@router.get("/mydataall", response_model=list[HealthDataRead])
async def get_my_all_reports(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    reports = db.query(HealthData)\
                .filter(HealthData.user_id == current_user.id)\
                .order_by(HealthData.created_at.desc())\
                .all()
    
    return reports


@router.get("/{report_id}", response_model=HealthDataRead)
async def get_report_by_id(
    report_id : UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    report = db.query(HealthData)\
        .filter(HealthData.id == report_id)\
        .first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not Found."
        )
    
    if current_user.role != "doctor" and report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this report."
        )

    return report