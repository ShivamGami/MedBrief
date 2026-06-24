from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..DataBase.Database import get_db
from ..Models.Auth_Data import Auth_User
from ..Models.Personal_Data import Doctor, Profile, GenderEnum
from ..Security.Dependencies import get_current_user
from ..Schemas.Auth_Schema import SignupRequest, LoginRequest, RefreshRequest, TokenResponse, UserResponse
from ..Security.Security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    SECRET_KEY,
    ALGORITHM,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Auth_User).filter(Auth_User.email == payload.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    welcome_name = payload.email.split("@")[0] or "user"

    new_user = Auth_User(
        username = welcome_name,
        email = payload.email,
        password = hash_password(payload.password),
        role = payload.role.lower()
    )

    db.add(new_user)
    db.flush()

    try:
        if payload.role.lower() == "doctor":
            doctor_entry = Doctor(
                user_id=new_user.id,
                name=welcome_name,
                email=payload.email,
                specialization="General",
                license_number=f"REG-{welcome_name.upper()}"
            )
            db.add(doctor_entry)
        else:
            patient_profile = Profile(
                user_id=new_user.id,
                name=welcome_name,
                age=0,
                gender=GenderEnum.OTHER,
                weight=0,
                height=0
            )
            db.add(patient_profile)
        db.commit()
    
    except Exception:
        db.rollback()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed To Create Role-Specific Profile"
        )
    return {
        "message" : f"User Registered Successfully as {payload.role}"
    }


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Auth_User).filter(Auth_User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    from jose import jwt, JWTError

    try:
        decoded = jwt.decode(payload.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = decoded.get("sub")
        token_type: str | None = decoded.get("type")

        if user_id is None or token_type != "refresh":
            raise ValueError("Invalid token")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user = db.query(Auth_User).filter(Auth_User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer"
    }


@router.get("/me")
def read_current_user(current_user: Auth_User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }