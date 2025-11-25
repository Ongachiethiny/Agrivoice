# AgriVoice API Documentation

## Overview
AgriVoice is an AI-powered crop diagnosis and analytics platform built with FastAPI (backend) and React (frontend). This documentation provides comprehensive API reference, deployment guidelines, and troubleshooting information.

**API Base URL:** `https://agrivoice-backend-aefdd2d38be7.herokuapp.com` (Production) or `http://localhost:5000` (Development)

**Current Version:** 1.0.0  
**Last Updated:** 2024

---

## Table of Contents
1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
   - [Auth Endpoints](#auth-endpoints)
   - [History Endpoints](#history-endpoints)
   - [Export Endpoints](#export-endpoints)
3. [Error Codes](#error-codes)
4. [Deployment Guide](#deployment-guide)
5. [Troubleshooting](#troubleshooting)
6. [Architecture](#architecture)

---

## Authentication

### Token-Based Authentication (JWT)

All authenticated endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

**Token Details:**
- **Access Token Expiry:** 24 hours (1440 minutes)
- **Refresh Token Expiry:** 7 days (10080 minutes)
- **Algorithm:** HS256
- **Storage:** Browser localStorage

### Getting Tokens

Tokens are obtained through the login endpoint and automatically refreshed as needed.

---

## API Endpoints

### Auth Endpoints

#### 1. Register User
**POST** `/api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": "uuid-123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

#### 2. Login User
**POST** `/api/auth/login`

Authenticates a user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1440
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. Refresh Access Token
**POST** `/api/auth/refresh`

Generates a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1440
  }
}
```

---

#### 4. Get User Profile
**GET** `/api/auth/profile`

Retrieves the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid-123",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

#### 5. Logout User
**POST** `/api/auth/logout`

Logs out the user and invalidates the current token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### History Endpoints

#### 1. Save Diagnosis
**POST** `/api/history/save`

Saves a new diagnosis to the user's history.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "Why are my tomato leaves turning yellow?",
  "language": "en",
  "detected_tags": ["yellowing", "chlorosis", "nutrient_deficiency"],
  "diagnosis_text": "Your tomato plants show signs of iron chlorosis, likely due to high soil pH or iron deficiency.",
  "translated_text": "Mbu ya kutokuwa na madini ya chuma...",
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "audio_base64": "data:audio/mp3;base64,ID3AgAAAAAA..."
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Diagnosis saved successfully",
  "data": {
    "diagnosis_id": "uuid-456",
    "created_at": "2024-01-15T11:00:00Z"
  }
}
```

---

#### 2. List All Diagnoses
**GET** `/api/history/list`

Retrieves all diagnoses for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional): Maximum number of records (default: 100)
- `offset` (optional): Number of records to skip (default: 0)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-456",
      "query": "Why are my leaves yellow?",
      "language": "en",
      "detected_tags": ["yellowing"],
      "diagnosis_text": "Iron chlorosis detected...",
      "timestamp": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

#### 3. Get Single Diagnosis
**GET** `/api/history/get/{diagnosis_id}`

Retrieves a specific diagnosis by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `diagnosis_id` (required): UUID of the diagnosis

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-456",
    "query": "Why are my leaves yellow?",
    "language": "en",
    "detected_tags": ["yellowing", "chlorosis"],
    "diagnosis_text": "Iron chlorosis detected...",
    "translated_text": null,
    "image_base64": "data:image/jpeg;base64,/9j/...",
    "audio_base64": "data:audio/mp3;base64,ID3...",
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Diagnosis not found"
}
```

---

#### 4. Delete Diagnosis
**DELETE** `/api/history/delete/{diagnosis_id}`

Deletes a specific diagnosis permanently.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `diagnosis_id` (required): UUID of the diagnosis to delete

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Diagnosis deleted successfully"
}
```

---

#### 5. Get History Statistics
**GET** `/api/history/stats`

Retrieves statistics about the user's diagnosis history.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_diagnoses": 15,
    "languages_used": {
      "en": 10,
      "sw": 3,
      "fr": 2
    },
    "top_diseases": [
      ["leaf_spot", 5],
      ["powdery_mildew", 3]
    ],
    "most_recent": "2024-01-15T11:00:00Z"
  }
}
```

---

### Export Endpoints

#### 1. Export Single Diagnosis as PDF
**POST** `/api/export/diagnosis/{diagnosis_id}/pdf`

Generates and downloads a PDF report for a single diagnosis.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `diagnosis_id` (required): UUID of the diagnosis

**Success Response (200 OK):**
- Content-Type: `application/pdf`
- Binary PDF file (download)

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Diagnosis not found"
}
```

---

#### 2. Export All History as PDF
**POST** `/api/export/history/pdf`

Generates and downloads a PDF report of the entire diagnosis history.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
- Content-Type: `application/pdf`
- Binary PDF file (download)

---

#### 3. Get Diagnosis PDF Preview (Base64)
**GET** `/api/export/diagnosis/{diagnosis_id}/preview`

Returns a single diagnosis PDF as base64-encoded string (for in-app preview).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "base64_pdf": "JVBERi0xLjQKJeLj..."
  }
}
```

---

#### 4. Get History PDF Preview (Base64)
**GET** `/api/export/history/preview`

Returns the entire history PDF as base64-encoded string (for in-app preview).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "base64_pdf": "JVBERi0xLjQKJeLj..."
  }
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid parameters or malformed request |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 422 | Unprocessable Entity | Validation error in request body |
| 500 | Internal Server Error | Server error |

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Description of what went wrong",
  "error_code": "SPECIFIC_ERROR"
}
```

### Common Error Codes

| Error Code | HTTP | Description |
|-----------|------|-------------|
| INVALID_TOKEN | 401 | Token is invalid or expired |
| INVALID_CREDENTIALS | 401 | Email or password is incorrect |
| USER_EXISTS | 409 | User with this email already exists |
| RESOURCE_NOT_FOUND | 404 | Requested resource does not exist |
| VALIDATION_ERROR | 422 | Request validation failed |
| SERVER_ERROR | 500 | Unexpected server error |

---

## Deployment Guide

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (optional)
- Azure Cognitive Services credentials

### Environment Variables

Create `.env` files for both frontend and backend:

**Backend (.env)**
```
VITE_JWT_SECRET=your-secret-key-here
VITE_JWT_ALGORITHM=HS256
VITE_ACCESS_TOKEN_EXPIRY=1440
VITE_REFRESH_TOKEN_EXPIRY=10080

# Azure Services
AZURE_VISION_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-vision-key
AZURE_SPEECH_KEY=your-speech-key
AZURE_SPEECH_REGION=<region>
AZURE_OPENAI_KEY=your-openai-key

DATA_DIR=./data
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

### Local Development Setup

1. **Backend Setup:**
```bash
cd backend-ai
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

2. **Frontend Setup:**
```bash
cd agrivoice-app
npm install
npm run dev
```

3. **Database Initialization:**
The application automatically creates necessary directories and files on first run.

### Docker Deployment

Using Docker Compose (includes frontend, backend, and PostgreSQL):

```bash
docker-compose up -d
```

Access the application at `http://localhost:3000`

### Production Deployment

**Backend (Heroku):**
```bash
heroku login
heroku create agrivoice-backend
git push heroku main
heroku config:set VITE_JWT_SECRET=your-production-secret
```

**Frontend (Vercel):**
```bash
npm install -g vercel
vercel --prod
```

### Database Migration

For production with PostgreSQL:
```bash
python -m alembic upgrade head
```

---

## Troubleshooting

### Authentication Issues

#### Problem: "Invalid or expired token"

**Causes:**
- Token has expired (24-hour expiry)
- Token was never valid
- Wrong token format in header

**Solutions:**
1. Refresh the token using `/api/auth/refresh`
2. Login again to get new tokens
3. Verify Authorization header format: `Bearer <token>`

#### Problem: "User with this email already exists"

**Causes:**
- Email is already registered in the system
- Previous registration attempt succeeded but didn't return properly

**Solutions:**
1. Use a different email address
2. Try to login with the existing email instead
3. Contact support to recover account if forgotten

---

### Diagnosis & History Issues

#### Problem: "Diagnosis not found"

**Causes:**
- Diagnosis ID is incorrect
- Diagnosis was deleted
- Accessing another user's diagnosis (data isolation)

**Solutions:**
1. Verify the correct diagnosis ID
2. Check your diagnosis history to confirm it exists
3. Ensure you're accessing your own data (tokens are user-specific)

#### Problem: Empty history despite saving diagnoses

**Causes:**
- Different user accounts were used
- Browser storage was cleared
- Server data not persisted

**Solutions:**
1. Verify you're logged in with the correct account
2. Make sure localStorage is enabled in browser
3. Check browser console for network errors

---

### Export Issues

#### Problem: "Failed to export PDF"

**Causes:**
- Network connectivity issues
- No diagnoses to export
- Server processing error
- Browser blocking download

**Solutions:**
1. Check internet connection
2. Ensure you have at least one diagnosis saved
3. Try again after a few seconds
4. Check browser download settings
5. Try PDF preview instead (in-app viewing)

#### Problem: Downloaded file is corrupted

**Causes:**
- Network interruption during download
- Browser cache issue
- Server generating invalid PDF

**Solutions:**
1. Clear browser cache and cookies
2. Try downloading again
3. Try PDF preview endpoint instead
4. Use a different browser

---

### Azure Services Integration

#### Problem: "Vision service error"

**Causes:**
- Invalid Azure credentials
- API key expired
- Service quota exceeded
- Network connectivity issue

**Solutions:**
1. Verify Azure credentials in `.env`
2. Check Azure portal for service status
3. Verify API key hasn't expired
4. Check usage quotas in Azure portal
5. Verify firewall/network access to Azure endpoints

#### Problem: "Speech synthesis failed"

**Causes:**
- Speech service not configured
- Unsupported language
- Service region mismatch
- Audio processing error

**Solutions:**
1. Verify speech service key and region in `.env`
2. Use supported language codes: en, sw, ar, fr, es, pt
3. Ensure language code matches service region
4. Check browser microphone permissions for audio playback

---

### Performance Issues

#### Problem: Slow diagnosis generation

**Causes:**
- Large image file
- Azure service latency
- Network slow connection
- Server resource constraint

**Solutions:**
1. Reduce image size before upload (< 5MB recommended)
2. Retry after a few seconds
3. Check internet connection speed
4. Verify server status page
5. Check Azure service availability

#### Problem: Slow PDF export

**Causes:**
- Large history with many diagnoses
- Server processing load
- Network latency

**Solutions:**
1. Export single diagnoses instead of full history
2. Delete old diagnoses to reduce history size
3. Retry during off-peak hours
4. Check server status

---

### Database Issues

#### Problem: "Data loss after server restart"

**Causes:**
- File-based storage not persisted in container
- Volume not mounted correctly in Docker
- Server filesystem reset

**Solutions:**
1. Use Docker volumes for persistent storage:
   ```bash
   docker run -v agrivoice_data:/app/data ...
   ```
2. Use PostgreSQL instead of file-based storage for production
3. Regular backups of data directory

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client Layer)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite, Tailwind CSS, React Router)  │   │
│  │  - Authentication Pages (Login, Register)           │   │
│  │  - Diagnosis Interface                              │   │
│  │  - History Management                               │   │
│  │  - PDF Export & Preview                             │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS/JSON
┌──────────────────▼──────────────────────────────────────────┐
│              FastAPI Backend (API Layer)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Router: /api/auth                                   │  │
│  │  - JWT Token Management                              │  │
│  │  - User Registration & Authentication                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Router: /api/history                                │  │
│  │  - Save/Retrieve/Delete Diagnoses                    │  │
│  │  - Statistics & Analytics                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Router: /api/export                                 │  │
│  │  - PDF Generation & Download                         │  │
│  │  - Base64 Preview Generation                         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
   ┌────────┐  ┌──────────┐  ┌──────────────┐
   │ Azure  │  │  Local   │  │  Azure Cog.  │
   │ Vision │  │ File DB  │  │  Services    │
   └────────┘  └──────────┘  └──────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
                ┌────────┐     ┌────────┐     ┌──────────┐
                │  GPT-4 │     │ Speech │     │ Language │
                │(Diag.) │     │Service │     │Translator│
                └────────┘     └────────┘     └──────────┘
```

### Data Flow

1. **User Registration/Login:**
   - User credentials → FastAPI `/api/auth/register|login`
   - JWT tokens generated (access + refresh)
   - Tokens stored in browser localStorage

2. **Diagnosis Flow:**
   - Image + question uploaded → Frontend validation
   - Sent to FastAPI → Azure Vision (image analysis)
   - GPT-4 (diagnosis generation) → Speech (audio synthesis)
   - Results saved to file-based database
   - Stored per-user in JSONL format

3. **History Management:**
   - User requests history → FastAPI retrieves user's JSONL file
   - Parsed and returned as JSON array
   - Frontend displays with filtering/sorting options

4. **PDF Export:**
   - Export request → ReportLab generates PDF
   - Contains formatted diagnosis data + metadata
   - Downloaded as binary file or returned as base64

### Technology Stack

**Backend:**
- Framework: FastAPI (Python 3.9+)
- Authentication: PyJWT (HS256)
- Database: File-based JSON + JSONL
- PDF Generation: ReportLab
- Azure Integration: Azure SDK (Vision, Speech, Language)
- Testing: Pytest + pytest-asyncio

**Frontend:**
- Framework: React 18+
- Build Tool: Vite
- Styling: Tailwind CSS
- Routing: React Router v6
- HTTP Client: Axios (via custom service)
- Testing: Jest + React Testing Library

**DevOps:**
- Containerization: Docker
- Orchestration: Docker Compose
- Hosting: Heroku (backend), Vercel (frontend)
- CI/CD: GitHub Actions (configured in .github/workflows)

### Security Considerations

1. **JWT Token Security:**
   - Tokens stored in localStorage (consider httpOnly cookies for production)
   - 24-hour expiry for access tokens
   - Automatic refresh mechanism

2. **User Data Isolation:**
   - Each diagnosis stored per-user
   - User ID extracted from JWT token
   - No cross-user data access possible

3. **HTTPS/TLS:**
   - All communication encrypted
   - Certificate validation required
   - Secure headers configured

4. **Input Validation:**
   - Pydantic models enforce schema validation
   - Email validation via email-validator
   - Password strength requirements

5. **Rate Limiting:**
   - Recommended: Implement rate limiter on production
   - Consider adding API key for service-to-service calls

---

## Support & Contact

For issues, feature requests, or questions:
- **GitHub Issues:** [Ongachiethiny/Agrivoice](https://github.com/Ongachiethiny/Agrivoice/issues)
- **Documentation:** [Full API Docs](https://agrivoice.example.com/docs)
- **Email:** support@agrivoice.example.com

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Maintainer:** AgriVoice Team
