# MedBrief AI

MedBrief AI is a comprehensive health management platform enabling patients to store and manage health records, medical reports, and prescriptions, with AI-powered analysis and real-time communication features.

## Overview

MedBrief provides a secure, production-ready platform with:
- **User Authentication & Role Management** — Separate patient and doctor workflows
- **Health Data Management** — Store vital signs, lab results, and clinical reports
- **AI-Powered Analysis** — Google Gemini integration for report summarization and health insights
- **Prescription Tracking** — Manage medications and dosage instructions
- **Appointment Scheduling** — Doctor-patient appointment coordination
- **Interactive Chat** — AI-assisted health guidance
- **Audit Logging** — Track data access for compliance

## Tech Stack

**Backend:**
- FastAPI (Python) with SQLAlchemy ORM
- SQLite/PostgreSQL database
- JWT authentication with bcrypt hashing
- Google Gemini API for AI analysis
- PDF extraction and processing

**Frontend:**
- React 19 with TypeScript
- Vite build tool
- React Router v7 for navigation
- TailwindCSS for styling

## Project Structure

```
MedBrief/
├── Backend/                    # Python FastAPI server
│   ├── main.py               # App initialization
│   ├── requirements.txt       # Python dependencies
│   ├── Security/             # Auth & JWT logic
│   ├── Models/               # SQLAlchemy models
│   ├── Schemas/              # Pydantic request/response schemas
│   ├── Router/               # API endpoints
│   ├── Core/                 # Business logic functions
│   ├── Services/             # External service integrations
│   ├── DataBase/             # Database configuration
│   └── alembic/              # Database migrations
│
├── Frontend/                 # React + Vite app
│   ├── src/
│   │   ├── Pages/           # Page components
│   │   ├── Components/      # Reusable components
│   │   ├── Config/          # API & type definitions
│   │   ├── Context/         # Auth context
│   │   ├── Css/             # Styling
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── readme.md               # This file
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (LTS)
- PostgreSQL or SQLite

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp Backend/.env.example Backend/.env
   ```
   Set values:
   ```env
   DATABASE_URL=sqlite:///./database.db
   SECRET_KEY=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key
   ALLOWED_HOSTS=http://localhost:5173,http://localhost:4173
   ```

3. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

4. **Start server:**
   ```bash
   python -m uvicorn Backend.main:app --reload
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure API endpoint:**
   Create `.env.local`:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## API Documentation

Access interactive API docs at `http://localhost:8000/docs` (Swagger UI)

### Core Endpoints

**Authentication:**
- `POST /auth/signup` — Register new user
- `POST /auth/login` — Login and get tokens
- `POST /auth/refresh` — Refresh access token
- `GET /auth/me` — Get current user

**Health Reports:**
- `POST /reports/upload` — Upload PDF health report
- `GET /reports/mydataall` — Get user's reports
- `GET /reports/{report_id}` — Get report details

**Profiles:**
- `POST /personal/profiles` — Create patient profile
- `GET /personal/profiles/{profile_id}` — Get profile
- `PUT /personal/profiles/{profile_id}` — Update profile
- `DELETE /personal/profiles/{profile_id}` — Delete profile

**Doctors:**
- `POST /personal/doctors` — Register doctor
- `GET /personal/doctors` — List doctors
- `GET /personal/doctors/{doctor_id}/patients` — Doctor's patients

**Prescriptions:**
- `POST /prescriptions/uploadprescription` — Add prescriptions
- `GET /prescriptions/active/{profile_id}` — Active prescriptions
- `GET /prescriptions/history/{profile_id}` — Prescription history

**Appointments:**
- `POST /system/appointments` — Schedule appointment
- `GET /system/appointments` — List appointments
- `PATCH /system/appointments/{id}` — Update appointment
- `DELETE /system/appointments/{id}` — Cancel appointment

**Chat:**
- `POST /system/chat` — Send message to AI
- `GET /system/chat/session/{session_id}` — Get conversation
- `GET /system/chat/user/{user_id}` — User chat history

## Database Schema

| Table | Purpose |
|-------|---------|
| `auth_users` | User authentication & roles |
| `Profile` | Patient demographics & baseline |
| `doctors` | Doctor profiles & specialties |
| `health_reports` | Lab results & vital signs |
| `medical_analysis` | AI analysis results |
| `prescriptions` | Medication tracking |
| `medicines` | Medicine catalog |
| `appointments` | Doctor-patient meetings |
| `chat_messages` | AI conversation history |
| `audit_logs` | Access logging |

## Production Deployment

### Environment Variables

Set these for production:

```env
# Backend
DATABASE_URL=postgresql://user:pass@host/dbname
SECRET_KEY=generate-a-strong-secret-key
DEBUG=False
ALLOWED_HOSTS=https://yourdomain.com,https://api.yourdomain.com

# Gemini
GEMINI_API_KEY=your-production-key
GEMINI_MODEL=gemini-1.5-pro

# Frontend
VITE_BACKEND_URL=https://api.yourdomain.com
```

### Deployment Checklist

- [ ] Use PostgreSQL in production (not SQLite)
- [ ] Set strong `SECRET_KEY`
- [ ] Configure CORS origins (remove `*`)
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure API rate limiting
- [ ] Use environment variables (never commit secrets)
- [ ] Enable audit logging
- [ ] Test all authentication flows
- [ ] Validate PDF upload limits
- [ ] Monitor API response times
- [ ] Set up error logging/monitoring

## Security Considerations

- JWT tokens expire after 30 minutes (configurable)
- Passwords hashed with bcrypt
- CORS restricted to configured hosts
- PDF upload size limited to 10MB
- Role-based access control (patient/doctor)
- Audit logs for data access
- SQL injection protection via SQLAlchemy ORM

## Common Issues

**CORS Errors:**
- Update `ALLOWED_HOSTS` in settings

**Database Connection:**
- Check `DATABASE_URL` format
- Verify PostgreSQL is running

**PDF Upload Fails:**
- Ensure file is valid PDF
- Check file size < 10MB

**Gemini API Errors:**
- Verify `GEMINI_API_KEY` is valid
- Check API quota

## Support & Contributing

For issues or contributions, please submit via the project repository.

## License

MIT License
