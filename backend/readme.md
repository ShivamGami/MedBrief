# MedBrief Backend API Documentation

This is the backend API for MedBrief AI, a health management platform built with FastAPI. It handles authentication, user profiles, health data management, AI analysis, and appointment scheduling.

## Technology Stack

- **Framework:** FastAPI
- **Database:** SQLAlchemy ORM (SQLite/PostgreSQL)
- **Authentication:** JWT with bcrypt
- **AI Integration:** Google Gemini
- **Document Processing:** PDF extraction & OCR
- **Database Migrations:** Alembic

## Database Schema

### Authentication

**`auth_users`** — User accounts and authentication
- `id` (UUID): Primary key
- `username` (String): Unique username
- `email` (String): Unique email
- `password` (String): Bcrypt hashed
- `role` (String): "patient" or "doctor"

Relationships:
- One-to-one: `Profile`
- One-to-many: `ChatMessage`, `HealthData`, `AuditLog`

### User Profiles

**`Profile`** — Patient demographics and health baseline
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key → `auth_users`
- `doctor_id` (UUID): Optional foreign key → `doctors`
- `name` (String): Patient name
- `age` (Integer): Patient age
- `gender` (Enum): 1=MALE, 2=FEMALE, 3=OTHER
- `weight` (Integer): kg
- `height` (Integer): cm

Relationships:
- One-to-many: `Appointment`, `HealthData`
- Many-to-one: `Doctor`

**`doctors`** — Doctor profiles
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key → `auth_users`
- `name` (String): Doctor name
- `email` (String): Doctor email
- `phone` (String): Phone number
- `specialization` (String): Medical specialty
- `license_number` (String): Medical license

Relationships:
- One-to-many: `Profile`, `Prescription`, `Appointment`

### Health Data

**`health_reports`** — Medical lab results and vital signs
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key → `auth_users`
- `uploaded_by` (UUID): Foreign key → `auth_users` (uploader)
- `pdf_path` (String): Path to uploaded PDF
- `created_at` (DateTime): Upload timestamp

Lab Fields:
- `ldl_cholesterol`, `hdl_cholesterol`, `triglycerides` (Float)
- `hba1c`, `fasting_glucose` (Float)
- `haemoglobin` (Float)
- `wbc_count`, `platelet_count` (Integer)
- `alt_ast`, `egfr` (Float)
- `resting_heart_rate` (Integer)
- `blood_pressure` (String): "120/80" format
- `spo2` (Float): 0-100 range

Relationships:
- One-to-one: `MedicalAnalysis`

**`medical_analysis`** — AI-generated health analysis
- `id` (UUID): Primary key
- `report_id` (UUID): Foreign key → `health_reports`
- `cardiac_risk_score` (String): Risk assessment
- `metabolic_status` (String): Metabolic health
- `kidney_status` (String): Kidney function
- `ai_summary` (String): AI analysis text
- `created_at` (DateTime): Analysis timestamp

Relationships:
- One-to-one: `HealthData`

### Medicines & Prescriptions

**`medicines`** — Medication catalog
- `id` (Integer): Primary key
- `name` (String): Medication name, unique
- `brand_name` (String): Brand name
- `dosage_form` (String): Tablet, capsule, etc.
- `strength` (String): Dosage strength
- `description` (String): Optional notes

Relationships:
- One-to-many: `Prescription`

**`prescriptions`** — Active and historical prescriptions
- `id` (UUID): Primary key
- `doctor_id` (UUID): Foreign key → `doctors`
- `profile_id` (UUID): Foreign key → `Profile`
- `medicine_id` (Integer): Foreign key → `medicines`
- `dosage_instructions` (String): "1 tablet twice daily"
- `duration` (String): "10 days" or "ongoing"
- `start_date` (DateTime): Start date
- `end_date` (DateTime): Optional end date
- `is_active` (Boolean): Currently active

Relationships:
- Many-to-one: `Doctor`, `Profile`, `Medicine`

### Appointments & Communication

**`appointments`** — Doctor-patient meetings
- `id` (UUID): Primary key
- `doctor_id` (UUID): Foreign key → `doctors`
- `profile_id` (UUID): Foreign key → `Profile`
- `start_time` (DateTime): Appointment start
- `end_time` (DateTime): Appointment end
- `status` (String): "scheduled", "completed", "cancelled"
- `meeting_link` (String): Optional video call link
- `notes` (String): Optional appointment notes

Relationships:
- Many-to-one: `Doctor`, `Profile`

**`chat_messages`** — AI conversation history
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key → `auth_users`
- `user_query` (String): User's question
- `ai_response` (String): AI's answer
- `chat_mode` (String): "gemini" or "doctor"
- `session_id` (UUID): Conversation session
- `timestamp` (DateTime): Message time

Relationships:
- Many-to-one: `Auth_User`

### Audit & Compliance

**`audit_logs`** — Access and action tracking
- `id` (UUID): Primary key
- `actor_id` (UUID): Foreign key → `auth_users` (who acted)
- `target_profile_id` (UUID): Foreign key → `Profile` (what was accessed)
- `action` (String): Action description
- `ip_address` (String): Requester IP
- `created_at` (DateTime): Action timestamp

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/signup` | ✗ | Register new user |
| POST | `/login` | ✗ | Login and get tokens |
| POST | `/refresh` | ✗ | Refresh access token |
| GET | `/me` | ✓ | Get current user |

### Health Reports (`/reports`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/upload` | ✓ | Upload PDF report |
| GET | `/mydataall` | ✓ | List user's reports |
| GET | `/{report_id}` | ✓ | Get report details |

### Personal Data (`/personal`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/profiles` | ✓ | Create profile |
| GET | `/profiles` | ✓ | List profiles |
| GET | `/profiles/{id}` | ✓ | Get profile |
| PUT | `/profiles/{id}` | ✓ | Update profile |
| DELETE | `/profiles/{id}` | ✓ | Delete profile |
| POST | `/doctors` | ✓ | Register doctor |
| GET | `/doctors` | ✓ | List doctors |
| GET | `/doctors/{id}` | ✓ | Get doctor |
| GET | `/doctors/{id}/patients` | ✓ | Doctor's patients |
| PUT | `/doctors/{id}` | ✓ | Update doctor |
| DELETE | `/doctors/{id}` | ✓ | Delete doctor |

### Prescriptions (`/prescriptions`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/uploadprescription` | ✓ | Add prescriptions |
| GET | `/active/{profile_id}` | ✓ | Active prescriptions |
| GET | `/history/{profile_id}` | ✓ | Prescription history |
| GET | `/{prescription_id}` | ✓ | Get prescription |

### System (`/system`)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/appointments` | ✓ | Schedule appointment |
| GET | `/appointments` | ✓ | List appointments |
| GET | `/appointments/{id}` | ✓ | Get appointment |
| PATCH | `/appointments/{id}` | ✓ | Update appointment |
| DELETE | `/appointments/{id}` | ✓ | Cancel appointment |
| POST | `/chat` | ✓ | Send chat message |
| GET | `/chat/session/{id}` | ✓ | Get conversation |
| GET | `/chat/user/{id}` | ✓ | User chat history |
| DELETE | `/chat/{id}` | ✓ | Delete message |

## Development

### Running Locally

```bash
cd Backend

pip install -r requirements.txt

python -m uvicorn main:app --reload
```

Server runs on `http://localhost:8000`

### Database Migrations

Create new migration:
```bash
alembic revision --autogenerate -m "Description"
```

Apply migrations:
```bash
alembic upgrade head
```

### Testing Endpoints

Access Swagger UI: `http://localhost:8000/docs`

## Production Deployment

### Environment Setup

Create `.env`:
```env
DATABASE_URL=postgresql://user:pass@host/dbname
SECRET_KEY=generate-strong-key
GEMINI_API_KEY=your-api-key
ALLOWED_HOSTS=https://yourdomain.com
DEBUG=False
```

### Checklist

- [ ] Use PostgreSQL (not SQLite)
- [ ] Set strong SECRET_KEY
- [ ] Configure CORS hosts
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Test all error cases
- [ ] Performance test APIs
- [ ] Security audit

## Error Handling

All errors follow standard HTTP status codes:

- `400` — Bad request (validation error)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `409` — Conflict (duplicate entry)
- `422` — Unprocessable entity (invalid data)
- `500` — Server error

## Security

- JWT tokens: 30-minute expiration
- Passwords: bcrypt with salt
- CORS: Restricted to configured hosts
- Database: SQL injection protection via ORM
- Audit logs: Track all data access
- Role-based access: Patient vs. Doctor
