# AgriVoice Architecture Documentation

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          END USER DEVICES                           │
│                    (Desktop, Mobile, Tablet)                        │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │        HTTPS/TLS (Secure)      │
                    └────────────────┬────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────┐
│                     FRONTEND LAYER (Presentation)                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    React Application                         │  │
│  │                    (Vite Build Tool)                         │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  Components                                          │   │  │
│  │  │  ├── Pages (Home, Login, Register, Diagnose, History)   │  │
│  │  │  ├── Layout (Navigation, Header, Footer)            │   │  │
│  │  │  └── Reusable Components (Forms, Cards, Buttons)   │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  Services (Business Logic)                           │   │  │
│  │  │  ├── authService (login, register, tokens)          │   │  │
│  │  │  ├── apiClient (HTTP requests to backend)           │   │  │
│  │  │  ├── exportService (PDF download)                   │   │  │
│  │  │  └── errorHandler (error handling, retries)         │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  State Management (localStorage)                    │   │  │
│  │  │  ├── User auth tokens (access + refresh)           │   │  │
│  │  │  ├── User profile data                             │   │  │
│  │  │  └── UI state                                      │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Styling: Tailwind CSS (Utility-first CSS Framework)              │
│  Routing: React Router v6 (Client-side routing)                   │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │        JSON over HTTPS          │
                    │    (RESTful API Calls)          │
                    └────────────────┬────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────┐
│                     BACKEND LAYER (Business Logic)                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               FastAPI Web Framework                         │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  API Routers (Endpoints)                             │   │  │
│  │  │                                                       │   │  │
│  │  │  Router: /api/auth                                   │   │  │
│  │  │  ├── POST /register      - User registration        │   │  │
│  │  │  ├── POST /login         - User authentication      │   │  │
│  │  │  ├── POST /refresh       - Token refresh            │   │  │
│  │  │  ├── GET  /profile       - Get user profile         │   │  │
│  │  │  └── POST /logout        - User logout              │   │  │
│  │  │                                                       │   │  │
│  │  │  Router: /api/history                                │   │  │
│  │  │  ├── POST /save          - Save diagnosis           │   │  │
│  │  │  ├── GET  /list          - List all diagnoses       │   │  │
│  │  │  ├── GET  /get/{id}      - Get single diagnosis     │   │  │
│  │  │  ├── DELETE /delete/{id} - Delete diagnosis         │   │  │
│  │  │  └── GET  /stats         - Get statistics           │   │  │
│  │  │                                                       │   │  │
│  │  │  Router: /api/export                                 │   │  │
│  │  │  ├── POST /diagnosis/{id}/pdf   - Export single PDF │   │  │
│  │  │  ├── POST /history/pdf          - Export all PDF    │   │  │
│  │  │  ├── GET  /diagnosis/{id}/preview - Preview base64 │   │  │
│  │  │  └── GET  /history/preview       - Preview base64  │   │  │
│  │  │                                                       │   │  │
│  │  │  Router: /api/copilot (AI Diagnosis) [Future]       │   │  │
│  │  │  ├── POST /diagnose      - Run diagnosis            │   │  │
│  │  │  ├── POST /translate     - Translate result         │   │  │
│  │  │  └── POST /explain       - Generate explanation     │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  Services (Business Logic Layer)                     │   │  │
│  │  │                                                       │   │  │
│  │  │  auth.py                                              │   │  │
│  │  │  ├── hash_password()      - Password hashing        │   │  │
│  │  │  ├── verify_password()    - Password verification   │   │  │
│  │  │  ├── create_access_token() - JWT token generation   │   │  │
│  │  │  ├── create_refresh_token() - Refresh token gen    │   │  │
│  │  │  └── verify_token()       - Token validation        │   │  │
│  │  │                                                       │   │  │
│  │  │  vision.py                                            │   │  │
│  │  │  └── analyze_crop_image() - Azure Vision API call   │   │  │
│  │  │                                                       │   │  │
│  │  │  gpt4.py                                              │   │  │
│  │  │  ├── generate_diagnosis() - GPT-4 diagnosis gen     │   │  │
│  │  │  └── generate_advice()    - Treatment advice        │   │  │
│  │  │                                                       │   │  │
│  │  │  speech.py                                            │   │  │
│  │  │  └── synthesize_speech()  - Audio synthesis          │   │  │
│  │  │                                                       │   │  │
│  │  │  pdf_generator.py                                     │   │  │
│  │  │  ├── generate_diagnosis_report() - Single PDF       │   │  │
│  │  │  └── generate_history_report()   - Full history PDF │   │  │
│  │  │                                                       │   │  │
│  │  │  error_handler.py                                     │   │  │
│  │  │  ├── retry_with_backoff() - Exponential backoff     │   │  │
│  │  │  └── error_response()     - Standardized errors     │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  Middleware & Security                              │   │  │
│  │  │  ├── JWT Middleware (token validation)              │   │  │
│  │  │  ├── CORS Middleware (cross-origin requests)        │   │  │
│  │  │  ├── Rate Limiting (optional)                       │   │  │
│  │  │  └── Error Handlers (exception handling)            │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ├─ config.py         - Configuration management                  │
│  ├─ models.py         - Pydantic data models                      │
│  ├─ main.py           - Application entry point                   │
│  └─ requirements.txt   - Python dependencies                      │
└──────────┬──────────────┬──────────────┬──────────────┬───────────┘
           │              │              │              │
           ▼              ▼              ▼              ▼
    ┌────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
    │   Azure    │ │   File-Based │ │   Azure Cog │ │   External   │
    │   Vision   │ │   Database   │ │  Services   │ │   Services   │
    │   Service  │ │   (JSON)     │ │             │ │              │
    └────────────┘ └──────────────┘ └─────────────┘ └──────────────┘
           │              │              │
           │              │          ┌───┴────┬────────┐
           │              │          ▼        ▼        ▼
           │              │      ┌────────┐┌──────┐┌──────────┐
           │              │      │ Speech ││ Lang ││ OpenAI   │
           │              │      │Service ││Trans ││ (GPT-4)  │
           │              │      └────────┘└──────┘└──────────┘
           │              │
        IMAGE          USER/DIAGNOSIS
      ANALYSIS         DATA STORAGE
```

---

## Component Architecture

### Frontend Component Hierarchy

```
App
├── Layout (Navigation & Routing)
│   ├── Header (Logo, Navigation Links)
│   ├── Main Routes
│   │   ├── Home Page
│   │   │   ├── Feature Cards
│   │   │   ├── Call-to-Action Buttons
│   │   │   └── Statistics
│   │   ├── Login Page (Protected)
│   │   │   ├── Email Input
│   │   │   ├── Password Input
│   │   │   └── Submit Button
│   │   ├── Register Page
│   │   │   ├── Username Input
│   │   │   ├── Email Input
│   │   │   ├── Password Input
│   │   │   ├── Full Name Input
│   │   │   └── Submit Button
│   │   ├── Diagnose Page (Protected)
│   │   │   ├── Image Upload
│   │   │   ├── Question Input
│   │   │   ├── Language Selector
│   │   │   ├── Submit Button
│   │   │   └── Results Display
│   │   │       ├── Diagnosis Text
│   │   │       ├── Translation
│   │   │       ├── Audio Player
│   │   │       ├── Action Items
│   │   │       └── Export Button
│   │   └── History Page (Protected)
│   │       ├── Statistics Panel
│   │       ├── History List
│   │       ├── Individual Diagnosis Detail
│   │       ├── Export History Button
│   │       └── Individual Export Buttons
│   ├── Footer (Links, Copyright)
│   └── Error Boundary (Error Handling)
```

### Backend Request Flow

```
Request
  ↓
Middleware (CORS, Auth Header)
  ↓
Router Layer (Route Matching)
  ↓
Authentication Middleware (JWT Validation)
  ↓
Request Handler (Route Function)
  ↓
Service Layer (Business Logic)
  │
  ├─→ Database Operations (Save/Retrieve/Delete)
  ├─→ External API Calls (Azure, OpenAI)
  ├─→ File Operations (PDF Generation)
  └─→ Data Transformations
  ↓
Response Formatting
  ↓
Response (JSON/Binary)
```

---

## Data Models

### User Model

```python
{
  "user_id": "uuid-string",
  "username": "john_doe",
  "email": "john@example.com",
  "password_hash": "bcrypt-hash",
  "full_name": "John Doe",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Diagnosis Model

```python
{
  "id": "uuid-string",
  "user_id": "uuid-string",
  "query": "Why are my leaves yellow?",
  "language": "en",
  "detected_tags": ["yellowing", "chlorosis"],
  "diagnosis_text": "Iron deficiency chlorosis...",
  "translated_text": "Upungufu wa chuma...",
  "image_base64": "data:image/jpeg;base64,...",
  "image_url": "https://...",
  "audio_base64": "data:audio/mp3;base64,...",
  "action_items": ["Apply iron chelate", "Check soil pH"],
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### JWT Token Payload

```python
{
  "sub": "user_id",           # Subject (user ID)
  "email": "user@example.com",
  "exp": 1705317600,          # Expiration time
  "iat": 1705231200,          # Issued at
  "type": "access"            # Token type
}
```

---

## Database Schema

### File-Based Storage

```
data/
├── users.json
│   └── {user_id: {...}, user_id: {...}}
│
├── history/
│   ├── user-id-1.jsonl
│   │   ├── {diagnosis_record_1}
│   │   ├── {diagnosis_record_2}
│   │   └── {diagnosis_record_3}
│   └── user-id-2.jsonl
│
└── images/
    ├── user-id-1/
    │   ├── diagnosis-id-1.jpg
    │   ├── diagnosis-id-2.jpg
    │   └── diagnosis-id-3.jpg
    └── user-id-2/
        └── diagnosis-id-4.jpg
```

### PostgreSQL Schema (For Production)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diagnoses Table
CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  language VARCHAR(10),
  detected_tags TEXT[],
  diagnosis_text TEXT,
  translated_text TEXT,
  image_url VARCHAR(1024),
  audio_url VARCHAR(1024),
  action_items TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX idx_diagnoses_created_at ON diagnoses(created_at DESC);
```

---

## Authentication Flow

### User Registration Flow

```
User ─→ Register Form ─→ Frontend
                             ↓
                      POST /api/auth/register
                             ↓
                    Backend: Validate Input
                             ↓
                    Backend: Hash Password
                             ↓
                    Backend: Save User
                             ↓
                      Return 201 Created
                             ↓
                      Frontend: Show Success
```

### User Login Flow

```
User ─→ Login Form ─→ Frontend
                           ↓
                  POST /api/auth/login
                           ↓
         Backend: Verify Email & Password
                           ↓
          Backend: Generate JWT Tokens
                           ↓
          Return Access & Refresh Tokens
                           ↓
    Frontend: Store Tokens in localStorage
                           ↓
    Frontend: Redirect to Dashboard
```

### Token Refresh Flow

```
Frontend: Access Token Expired
                ↓
    POST /api/auth/refresh
    (with refresh_token)
                ↓
    Backend: Validate Refresh Token
                ↓
    Backend: Generate New Access Token
                ↓
    Return New Access Token
                ↓
Frontend: Update Token in Storage
```

### Protected Request Flow

```
Frontend: Request Protected Resource
                ↓
    Add Authorization Header
    (Authorization: Bearer <access_token>)
                ↓
        POST /api/protected-endpoint
                ↓
Backend: JWT Middleware
  - Extract token from header
  - Verify signature
  - Check expiration
                ↓
    IF valid: Process request
    IF invalid: Return 401 Unauthorized
                ↓
    Backend: Process request
                ↓
    Return protected resource
```

---

## Diagnosis Workflow

```
User Uploads Image
        ↓
Validate Image Size (< 5MB)
        ↓
Compress Image
        ↓
POST /api/copilot/diagnose (Backend)
        ↓
┌─────────────────────────────────┐
│  Analyze with Azure Vision API  │
│  - Extract image features       │
│  - Identify potential issues    │
│  - Generate initial tags        │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Generate Diagnosis with GPT-4  │
│  - Analyze vision results       │
│  - Combine with user query      │
│  - Generate detailed diagnosis  │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Generate Action Items          │
│  - Recommend treatments         │
│  - Suggest prevention measures  │
│  - Provide best practices       │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Translate if Needed            │
│  - Translate diagnosis text     │
│  - Maintain terminology         │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Generate Audio (Text-to-Speech)│
│  - Synthesize diagnosis         │
│  - Apply language settings      │
│  - Return MP3 file              │
└─────────────────────────────────┘
        ↓
Save Diagnosis to Database
        ↓
Return Results to Frontend
        ↓
Display Results to User
```

---

## PDF Export Workflow

```
User Clicks Export Button
        ↓
Frontend: Prepare Data
  - Get diagnosis ID or user history
  - Set up download request
        ↓
Backend: Generate PDF
        ↓
┌──────────────────────────────────┐
│  Fetch Diagnosis/History Data    │
│  from Database                   │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│  Format Data with ReportLab      │
│  - Create PDF document           │
│  - Add headers and footers       │
│  - Format diagnosis text         │
│  - Add metadata                  │
│  - Add timestamps                │
└──────────────────────────────────┘
        ↓
Return PDF (Binary)
        ↓
Frontend: Download
  - Browser downloads file
  - Save as user_diagnosis_YYYYMMDD.pdf
```

---

## Deployment Topology

### Development Environment

```
Developer Machine
├── Frontend (npm run dev)
│   └── http://localhost:5173
├── Backend (uvicorn)
│   └── http://localhost:5000
└── Local Data
    └── ./data/
```

### Docker Development

```
Docker Host Machine
├── Frontend Container (Port 3000)
├── Backend Container (Port 5000)
├── PostgreSQL Container (Port 5432)
└── Shared Volumes
    ├── ./agrivoice-app
    ├── ./backend-ai
    └── postgres_data
```

### Production Environment

```
┌─────────────────────────────────────────────┐
│           Production Infrastructure         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Frontend (Vercel)                   │ │
│  │  - React Application                 │ │
│  │  - Automatic CI/CD from GitHub       │ │
│  │  - CDN Distribution                  │ │
│  │  - HTTPS/TLS Enabled                 │ │
│  └──────────────────────────────────────┘ │
│                   │                        │
│              HTTPS API                     │
│                   │                        │
│  ┌──────────────────────────────────────┐ │
│  │  Backend (Heroku)                    │ │
│  │  - FastAPI Application               │ │
│  │  - Auto-scaling                      │ │
│  │  - Environment variables             │ │
│  │  - SSL/TLS Enabled                   │ │
│  └──────────────────────────────────────┘ │
│                   │                        │
│          Database Connection               │
│                   │                        │
│  ┌──────────────────────────────────────┐ │
│  │  Database (AWS RDS PostgreSQL)       │ │
│  │  - Managed database service          │ │
│  │  - Automated backups                 │ │
│  │  - Multi-AZ replication              │ │
│  │  - Encrypted storage                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Azure Cognitive Services            │ │
│  │  - Computer Vision API               │ │
│  │  - Speech Services                   │ │
│  │  - OpenAI (GPT-4)                    │ │
│  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌────────────────────────────────────────┐
│         User Authentication            │
│                                        │
│  Email + Password (HTTPS)              │
│  ↓                                     │
│  Password Hashing (bcrypt)             │
│  ↓                                     │
│  User Storage                          │
└────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│          JWT Token Generation          │
│                                        │
│  Secret Key (secure random)            │
│  User ID in payload                    │
│  Expiration time (24 hours)            │
│  Signature (HS256)                     │
└────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│        Browser Token Storage           │
│                                        │
│  localStorage (production: httpOnly)   │
│  Secure flag enabled                   │
│  SameSite cookie policy                │
└────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│      Protected Request Validation      │
│                                        │
│  Authorization header check            │
│  Token signature verification          │
│  Expiration validation                 │
│  User ID extraction                    │
└────────────────────────────────────────┘
```

---

## Scalability Considerations

### Current Architecture Limits

- **Single-machine deployment:** ~1,000 concurrent users
- **File-based storage:** ~100,000 diagnoses before performance degradation
- **API rate limits:** No rate limiting implemented (add for production)

### Scaling Strategies

1. **Horizontal Scaling:**
   - Multiple backend instances behind load balancer
   - Frontend served via CDN
   - Separate database server

2. **Vertical Scaling:**
   - Increase server resources
   - Upgrade to higher tier on Heroku
   - Increase database connections

3. **Caching:**
   - Redis for session management
   - Cloudflare for static content
   - Browser caching headers

4. **Database Optimization:**
   - Add indexes on frequently queried columns
   - Archive old diagnoses
   - Implement pagination

---

**Last Updated:** January 2024  
**Version:** 1.0.0
