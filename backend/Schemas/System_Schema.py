from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
from typing import Literal

from .Auth_Schema import UserResponse


class AppointmentBase(BaseModel):
    doctor_id: UUID
    profile_id: UUID
    start_time: datetime
    end_time: datetime

    status: Literal[
        "pending",
        "approved",
        "rejected",
        "completed",
        "cancelled"
    ] = "pending"

class AppointmentStatusUpdate(BaseModel):
    status: Literal[
        "approved",
        "rejected",
        "completed",
        "cancelled"
    ] 


    
class AppointmentRead(AppointmentBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

class NotificationRead(BaseModel):
    id: UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AuditLogCreate(BaseModel):
    actor_id: UUID
    target_profile_id: UUID
    action: str
    ip_address: Optional[str] = None


class ChatMessageBase(BaseModel):
    user_query: str = Field(..., min_length=1)
    session_id: Optional[UUID] = None
    chat_mode: str = Field("gemini", pattern=r"^(gemini|doctor)$")

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageRead(ChatMessageBase):
    id: UUID
    user_id: UUID
    ai_response: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class ChatSessionResponse(BaseModel):
    session_id: UUID
    messages: list[ChatMessageRead]

class ChatMessageWithUser(ChatMessageRead):
    owner: UserResponse