"""
User Authentication Router
Handles user registration, login, and token refresh
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
import json
from pathlib import Path
from app.services.auth import TokenManager
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# File-based user storage (for demo purposes)
USERS_FILE = Path("./data/users.json")
USERS_FILE.parent.mkdir(parents=True, exist_ok=True)


class UserRegisterRequest(BaseModel):
    """User registration request model"""
    email: EmailStr
    password: str
    full_name: str
    farm_location: Optional[str] = None


class UserLoginRequest(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str


class TokenRefreshRequest(BaseModel):
    """Token refresh request model"""
    refresh_token: str


class AuthResponse(BaseModel):
    """Authentication response model"""
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    user: dict


class UserResponse(BaseModel):
    """User profile response model"""
    user_id: str
    email: str
    full_name: str
    farm_location: Optional[str]
    created_at: str
    diagnosis_count: int


# Utility functions for user storage
def load_users() -> dict:
    """Load users from file"""
    if USERS_FILE.exists():
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}


def save_users(users: dict):
    """Save users to file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)


def hash_password(password: str) -> str:
    """Hash password (in production, use bcrypt)"""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hash_value: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hash_value


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Extract and verify current user from authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = parts[1]
        payload = TokenManager.verify_token(token, token_type="access")
        
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return payload
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/register", response_model=AuthResponse)
async def register(request: UserRegisterRequest):
    """
    Register a new user
    
    Request:
        - email: User's email address
        - password: User's password
        - full_name: User's full name
        - farm_location: (Optional) User's farm location
        
    Response:
        - access_token: JWT access token
        - refresh_token: JWT refresh token
        - user: User profile information
    """
    try:
        users = load_users()
        
        # Check if user already exists
        if any(u["email"] == request.email for u in users.values()):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        user_id = str(uuid.uuid4())
        user_data = {
            "user_id": user_id,
            "email": request.email,
            "password_hash": hash_password(request.password),
            "full_name": request.full_name,
            "farm_location": request.farm_location,
            "created_at": datetime.now().isoformat(),
            "diagnosis_count": 0
        }
        
        users[user_id] = user_data
        save_users(users)
        
        # Create tokens
        tokens = TokenManager.create_tokens(user_id, request.email)
        
        return AuthResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            expires_in=tokens["expires_in"],
            user={
                "user_id": user_id,
                "email": request.email,
                "full_name": request.full_name
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(request: UserLoginRequest):
    """
    Login user with email and password
    
    Request:
        - email: User's email address
        - password: User's password
        
    Response:
        - access_token: JWT access token
        - refresh_token: JWT refresh token
        - user: User profile information
    """
    try:
        users = load_users()
        
        # Find user by email
        user = None
        for u in users.values():
            if u["email"] == request.email:
                user = u
                break
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(request.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create tokens
        tokens = TokenManager.create_tokens(user["user_id"], user["email"])
        
        return AuthResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            expires_in=tokens["expires_in"],
            user={
                "user_id": user["user_id"],
                "email": user["email"],
                "full_name": user["full_name"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh", response_model=dict)
async def refresh_token(request: TokenRefreshRequest):
    """
    Refresh access token using refresh token
    
    Request:
        - refresh_token: Valid refresh token
        
    Response:
        - access_token: New JWT access token
        - token_type: Token type (bearer)
        - expires_in: Token expiration time in seconds
    """
    try:
        new_tokens = TokenManager.refresh_access_token(request.refresh_token)
        
        if not new_tokens:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        return {
            "access_token": new_tokens["access_token"],
            "token_type": new_tokens["token_type"],
            "expires_in": new_tokens["expires_in"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user's profile
    
    Returns:
        - user_id: User's unique ID
        - email: User's email
        - full_name: User's full name
        - farm_location: User's farm location
        - created_at: Account creation date
        - diagnosis_count: Number of diagnoses user has performed
    """
    try:
        users = load_users()
        user_data = users.get(current_user["user_id"])
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            user_id=user_data["user_id"],
            email=user_data["email"],
            full_name=user_data["full_name"],
            farm_location=user_data.get("farm_location"),
            created_at=user_data["created_at"],
            diagnosis_count=user_data.get("diagnosis_count", 0)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout user (token invalidation handled by client)
    
    Note: In production, maintain a token blacklist to prevent reuse of old tokens
    """
    return {
        "message": "Logged out successfully",
        "user_id": current_user["user_id"]
    }


# Import datetime for created_at timestamp
from datetime import datetime
