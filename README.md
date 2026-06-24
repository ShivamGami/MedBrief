<div align="center">

# 🩺 MedBrief AI

**A secure, production-ready health management platform for patients and doctors — powered by AI.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](#prerequisites)
[![Node](https://img.shields.io/badge/Node.js-18%2B%20LTS-339933.svg)](#prerequisites)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](#tech-stack)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg)](#tech-stack)

</div>

---

## 📖 Overview

MedBrief AI lets patients securely store and manage their health records, lab reports, and prescriptions, while giving doctors the tools to track patients, review history, and communicate — all backed by AI-powered analysis.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Authentication & Roles** | Separate, secure workflows for patients and doctors |
| 📊 **Health Data Management** | Centralized storage for vitals, lab results, and clinical reports |
| 🤖 **AI-Powered Analysis** | Google Gemini integration for report summarization and health insights |
| 💊 **Prescription Tracking** | Manage medications, dosages, and prescription history |
| 📅 **Appointment Scheduling** | Coordinate doctor–patient appointments |
| 💬 **Interactive AI Chat** | Conversational health guidance for patients |
| 🛡️ **Audit Logging** | Full access trail for compliance and accountability |

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Production Deployment](#production-deployment)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Support & Contributing](#support--contributing)
- [License](#license)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | FastAPI (Python) |
| **ORM** | SQLAlchemy |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Authentication** | JWT with bcrypt password hashing |
| **AI Engine** | Google Gemini API |
| **Document Processing** | PDF extraction & parsing |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Routing** | React Router v7 |
| **Styling** | TailwindCSS |

---

## 📁 Project Structure

```
MedBrief/
├── Backend/                  # Python FastAPI server
│   ├── main.py                # App initialization
│   ├── requirements.txt       # Python dependencies
│   ├── Security/               # Auth & JWT logic
│   ├── Models/                 # SQLAlchemy models
│   ├── Schemas/                # Pydantic request/response schemas
│   ├── Router/                 # API endpoints
│   ├── Core/                   # Business logic functions
│   ├── Services/               # External service integrations
│   ├── DataBase/                # Database configuration
│   └── alembic/                 # Database migrations
│
├── Frontend/                 # React + Vite app
│   ├── src/
│   │   ├── Pages/                # Page components
│   │   ├── Components/           # Reusable components
│   │   ├── Config/                # API & type definitions
│   │   ├── Context/               # Auth context
│   │   ├── Css/                    # Styling
│   │   └── main.tsx                # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Python** 3.10+
- **Node.js** 18+ (LTS)
- **PostgreSQL** or **SQLite**

### Backend Setup

1. **Install dependencies**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

2. **Configure environment variables**
   ```bash
   cp Backend/.env.example Backend/.env
   ```
   Then set the following values in `.env`:
   ```env
   DATABASE_URL=sqlite:///./database.db
   SECRET_KEY=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key
   ALLOWED_HOSTS=http://localhost:5173,http://localhost:4173
   ```

3. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start the server**
   ```bash
   python -m uvicorn Backend.main:app --reload
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure the API endpoint**

   Create a `.env.local` file:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📡 API Documentation

Interactive API docs (Swagger UI) are available at:

```
http://localhost:8000/docs
```

### Core Endpoints

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login and receive tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/auth/me` | Get current authenticated user |

</details>

<details>
<summary><strong>📊 Health Reports</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/reports/upload` | Upload a PDF health report |
| `GET` | `/reports/mydataall` | Get all reports for current user |
| `GET` | `/reports/{report_id}` | Get details for a specific report |

</details>

<details>
<summary><strong>👤 Profiles</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/personal/profiles` | Create a patient profile |
| `GET` | `/personal/profiles/{profile_id}` | Get a profile |
| `PUT` | `/personal/profiles/{profile_id}` | Update a profile |
| `DELETE` | `/personal/profiles/{profile_id}` | Delete a profile |

</details>

<details>
<summary><strong>🩺 Doctors</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/personal/doctors` | Register a doctor |
| `GET` | `/personal/doctors` | List all doctors |
| `GET` | `/personal/doctors/{doctor_id}/patients` | Get a doctor's patients |

</details>

<details>
<summary><strong>💊 Prescriptions</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/prescriptions/uploadprescription` | Add prescriptions |
| `GET` | `/prescriptions/active/{profile_id}` | Get active prescriptions |
| `GET` | `/prescriptions/history/{profile_id}` | Get prescription history |

</details>

<details>
<summary><strong>📅 Appointments</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/system/appointments` | Schedule an appointment |
| `GET` | `/system/appointments` | List appointments |
| `PATCH` | `/system/appointments/{id}` | Update an appointment |
| `DELETE` | `/system/appointments/{id}` | Cancel an appointment |

</details>

<details>
<summary><strong>💬 Chat</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/system/chat` | Send a message to the AI |
| `GET` | `/system/chat/session/{session_id}` | Get a full conversation |
| `GET` | `/system/chat/user/{user_id}` | Get a user's chat history |

</details>

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `auth_users` | User authentication & roles |
| `Profile` | Patient demographics & baseline data |
| `doctors` | Doctor profiles & specialties |
| `health_reports` | Lab results & vital signs |
| `medical_analysis` | AI-generated analysis results |
| `prescriptions` | Medication tracking |
| `medicines` | Medicine catalog |
| `appointments` | Doctor–patient meetings |
| `chat_messages` | AI conversation history |
| `audit_logs` | Access logging for compliance |

---

## 🌐 Production Deployment

### Environment Variables

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
- [ ] Set a strong, unique `SECRET_KEY`
- [ ] Configure CORS origins (remove wildcard `*`)
- [ ] Enable HTTPS/SSL
- [ ] Set up automated database backups
- [ ] Configure API rate limiting
- [ ] Store secrets in environment variables — never commit them
- [ ] Enable audit logging
- [ ] Test all authentication flows end-to-end
- [ ] Validate PDF upload size and type limits
- [ ] Monitor API response times
- [ ] Set up error logging and alerting

---

## 🔒 Security Considerations

- JWT tokens expire after 30 minutes (configurable)
- Passwords are hashed using **bcrypt**
- CORS is restricted to explicitly configured hosts
- PDF uploads are limited to **10MB**
- Role-based access control (patient / doctor)
- Audit logs track all sensitive data access
- SQL injection protection via the SQLAlchemy ORM

---

## 🧰 Troubleshooting

| Issue | Solution |
|---|---|
| **CORS errors** | Update `ALLOWED_HOSTS` in your settings |
| **Database connection fails** | Check the `DATABASE_URL` format and confirm PostgreSQL is running |
| **PDF upload fails** | Ensure the file is a valid PDF and under 10MB |
| **Gemini API errors** | Verify `GEMINI_API_KEY` is valid and check your API quota |

---

## 🤝 Support & Contributing

Contributions, issues, and feature requests are welcome.
Please submit them through the project repository's **Issues** and **Pull Requests** tabs.

---

## 📄 License

This project is licensed under the **MIT License**.
