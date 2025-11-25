"""
JWT Token Management for User Authentication
Handles token generation, validation, and user session management
"""

from datetime import datetime, timedelta
from typing import Optional
import jwt
from app.config import settings


class TokenManager:
    """Manages JWT token creation and validation"""
    
    @staticmethod
    def create_tokens(user_id: str, email: str) -> dict:
        """
        Create access and refresh tokens for a user
        
        Args:
            user_id: Unique user identifier
            email: User's email address
            
        Returns:
            Dictionary with access_token and refresh_token
        """
        # Access token (short-lived)
        access_payload = {
            "user_id": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
            "iat": datetime.utcnow(),
            "type": "access"
        }
        
        # Refresh token (long-lived)
        refresh_payload = {
            "user_id": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_EXPIRATION_DAYS),
            "iat": datetime.utcnow(),
            "type": "refresh"
        }
        
        access_token = jwt.encode(
            access_payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        
        refresh_token = jwt.encode(
            refresh_payload,
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_EXPIRATION_HOURS * 3600
        }
    
    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Optional[dict]:
        """
        Verify and decode a JWT token
        
        Args:
            token: JWT token string
            token_type: Type of token ('access' or 'refresh')
            
        Returns:
            Decoded payload if valid, None if invalid or expired
        """
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )
            
            if payload.get("type") != token_type:
                return None
                
            return payload
            
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {str(e)}")
            return None
    
    @staticmethod
    def refresh_access_token(refresh_token: str) -> Optional[dict]:
        """
        Generate a new access token using a refresh token
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            New access token or None if refresh token is invalid
        """
        payload = TokenManager.verify_token(refresh_token, token_type="refresh")
        
        if not payload:
            return None
        
        new_tokens = TokenManager.create_tokens(
            user_id=payload["user_id"],
            email=payload["email"]
        )
        
        return new_tokens
