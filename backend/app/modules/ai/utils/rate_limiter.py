"""
app/modules/ai/utils/rate_limiter.py

Simple abstraction for rate limiting AI provider requests to prevent abuse.
"""

from fastapi import HTTPException, status
from typing import Dict
from datetime import datetime, timedelta

# In a production app, this would use Redis. We'll use a simple in-memory dict for now.
# Format: { "user_id": [timestamp1, timestamp2, ...] }
_request_history: Dict[str, list[datetime]] = {}

class AIRateLimiter:
    """Limits AI API calls per user."""
    
    def __init__(self, max_requests: int = 10, window_minutes: int = 60):
        self.max_requests = max_requests
        self.window = timedelta(minutes=window_minutes)
        
    def check_rate_limit(self, user_id: str):
        now = datetime.utcnow()
        
        # Initialize if not exists
        if user_id not in _request_history:
            _request_history[user_id] = []
            
        history = _request_history[user_id]
        
        # Remove timestamps older than the window
        _request_history[user_id] = [ts for ts in history if now - ts < self.window]
        
        if len(_request_history[user_id]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"AI rate limit exceeded. Max {self.max_requests} requests per {self.window.total_seconds() / 60} minutes."
            )
            
        # Record the new request
        _request_history[user_id].append(now)
