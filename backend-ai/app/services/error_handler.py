"""
Backend Error Handling Utilities
Provides retry logic, error logging, and graceful error handling
"""

import logging
from functools import wraps
from fastapi import HTTPException
from datetime import datetime, timedelta
import time
import random

# Configure logging
logger = logging.getLogger(__name__)


class RetryConfig:
    """Configuration for retry logic"""
    def __init__(
        self,
        max_retries: int = 3,
        initial_delay: float = 1.0,
        max_delay: float = 10.0,
        backoff_multiplier: float = 2.0,
        jitter: bool = True
    ):
        self.max_retries = max_retries
        self.initial_delay = initial_delay
        self.max_delay = max_delay
        self.backoff_multiplier = backoff_multiplier
        self.jitter = jitter


class RetryableError(Exception):
    """Errors that should be retried"""
    pass


class NonRetryableError(Exception):
    """Errors that should not be retried"""
    pass


def retry_with_backoff(config: RetryConfig = None, retryable_exceptions: tuple = None):
    """
    Decorator for automatic retry with exponential backoff
    
    Args:
        config: RetryConfig object with retry settings
        retryable_exceptions: Tuple of exceptions to retry on
    """
    if config is None:
        config = RetryConfig()
    
    if retryable_exceptions is None:
        retryable_exceptions = (RetryableError, TimeoutError, ConnectionError)
    
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            last_exception = None
            delay = config.initial_delay
            
            for attempt in range(config.max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except NonRetryableError:
                    raise
                except retryable_exceptions as e:
                    last_exception = e
                    
                    if attempt < config.max_retries:
                        # Add jitter to prevent thundering herd
                        actual_delay = delay
                        if config.jitter:
                            actual_delay = delay * (0.5 + random.random())
                        
                        logger.warning(
                            f"Attempt {attempt + 1} failed for {func.__name__}: {str(e)}. "
                            f"Retrying in {actual_delay:.2f}s..."
                        )
                        
                        await asyncio.sleep(actual_delay)
                        delay = min(delay * config.backoff_multiplier, config.max_delay)
                    else:
                        logger.error(
                            f"All {config.max_retries + 1} attempts failed for {func.__name__}: {str(e)}"
                        )
            
            raise last_exception or Exception(f"Function {func.__name__} failed after retries")
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            last_exception = None
            delay = config.initial_delay
            
            for attempt in range(config.max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except NonRetryableError:
                    raise
                except retryable_exceptions as e:
                    last_exception = e
                    
                    if attempt < config.max_retries:
                        actual_delay = delay
                        if config.jitter:
                            actual_delay = delay * (0.5 + random.random())
                        
                        logger.warning(
                            f"Attempt {attempt + 1} failed for {func.__name__}: {str(e)}. "
                            f"Retrying in {actual_delay:.2f}s..."
                        )
                        
                        time.sleep(actual_delay)
                        delay = min(delay * config.backoff_multiplier, config.max_delay)
                    else:
                        logger.error(
                            f"All {config.max_retries + 1} attempts failed for {func.__name__}: {str(e)}"
                        )
            
            raise last_exception or Exception(f"Function {func.__name__} failed after retries")
        
        # Return appropriate wrapper based on if function is async
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator


class RateLimiter:
    """Simple rate limiter to prevent overload"""
    def __init__(self, max_requests: int = 100, time_window: int = 60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = {}
    
    def is_allowed(self, key: str) -> bool:
        """Check if request is allowed"""
        now = datetime.now()
        
        if key not in self.requests:
            self.requests[key] = []
        
        # Remove old requests outside the time window
        cutoff = now - timedelta(seconds=self.time_window)
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if req_time > cutoff
        ]
        
        # Check if we've exceeded max requests
        if len(self.requests[key]) >= self.max_requests:
            return False
        
        # Add this request
        self.requests[key].append(now)
        return True


def validate_api_response(response_data: dict, required_fields: list) -> bool:
    """
    Validate API response has required fields
    
    Args:
        response_data: Response dictionary
        required_fields: List of required field names
        
    Returns:
        True if all required fields present, False otherwise
    """
    if not isinstance(response_data, dict):
        return False
    
    for field in required_fields:
        if field not in response_data or response_data[field] is None:
            return False
    
    return True


def get_fallback_response(error_type: str, context: str = ""):
    """
    Generate fallback response for common errors
    
    Args:
        error_type: Type of error (network, server, auth, validation)
        context: Additional context about the error
        
    Returns:
        Fallback response dictionary
    """
    fallbacks = {
        "network": {
            "status": "error",
            "error": "Network connection issue. Please check your internet connection and try again.",
            "recovery_suggestion": "Retry the operation or refresh the page"
        },
        "server": {
            "status": "error",
            "error": "Server temporarily unavailable. Our team has been notified.",
            "recovery_suggestion": "Please try again in a few moments"
        },
        "auth": {
            "status": "error",
            "error": "Authentication failed. Please log in again.",
            "recovery_suggestion": "Click 'Log in' to authenticate"
        },
        "validation": {
            "status": "error",
            "error": f"Invalid input: {context}",
            "recovery_suggestion": "Please check your input and try again"
        },
        "timeout": {
            "status": "error",
            "error": "Request took too long. Please try again.",
            "recovery_suggestion": "The server may be busy. Please retry"
        }
    }
    
    return fallbacks.get(error_type, fallbacks["server"])


def format_error_response(error: Exception, status_code: int = 500) -> dict:
    """
    Format error into standard response format
    
    Args:
        error: The exception
        status_code: HTTP status code
        
    Returns:
        Formatted error response
    """
    error_type = "server" if status_code >= 500 else "client"
    
    return {
        "status": "error",
        "error": str(error),
        "error_type": error_type,
        "timestamp": datetime.now().isoformat(),
        "status_code": status_code
    }


# Import asyncio for async operations
import asyncio
