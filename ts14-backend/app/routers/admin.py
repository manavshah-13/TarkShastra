from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User as UserModel, UserRole
from app.schemas.user import User, UserCreate
from app.routers.auth import get_current_user
from app.core.security import get_password_hash
from sqlalchemy import func
from app.models.complaint import Complaint as ComplaintModel

router = APIRouter(prefix="/admin", tags=["administration"])

@router.get("/users", response_model=list[User])
async def list_users(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(UserModel).all()

@router.post("/users", response_model=User)
async def create_user(user_in: UserCreate, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_user = UserModel(
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/workload")
async def get_workload(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    workload = db.query(
        UserModel.username, 
        func.count(ComplaintModel.id)
    ).join(ComplaintModel, UserModel.id == ComplaintModel.assigned_to, isouter=True).group_by(UserModel.username).all()
    
    return {user: count for user, count in workload}
