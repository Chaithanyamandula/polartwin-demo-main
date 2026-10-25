from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.security.auth import decode_access_token
from app.security.rbac import check_role

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    # If credentials provided, attempt to authenticate
    if credentials:
        payload = decode_access_token(credentials.credentials)
        if payload and "sub" in payload:
            email = payload.get("sub")
            user = db.query(User).filter(User.email == email).first()
            if user:
                return user
    
    # Open Access: Default to admin user so all modules and controls work without credentials
    admin_user = db.query(User).filter(User.role == "admin").first()
    if admin_user:
        return admin_user
    
    return User(
        user_id="default_admin",
        email="admin@polartwin.gov.in",
        role="admin"
    )

def require_role(min_role: str):
    def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        check_role(current_user.role, min_role)
        return current_user
    return role_dependency

require_viewer = require_role("viewer")
require_operator = require_role("operator")
require_admin = require_role("admin")
