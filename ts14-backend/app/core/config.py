import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from app.utils.paths import get_project_root

class Settings(BaseSettings):
    PROJECT_NAME: str = "TarkShastra Backend"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440
    AI_MODEL_PATH: str = "models.pkl"
    
    # ML Models & Data Paths (Dynamically Discovered)
    PROJECT_ROOT: str = str(get_project_root())
    MODELS_DIR: str = str(get_project_root())
    DATA_FILE_PATH: str = os.path.join(str(get_project_root()), "TS-PS14.csv")

    model_config = SettingsConfigDict(
        env_file=os.path.join(str(get_project_root()), "ts14-backend", ".env"),
        extra="ignore"
    )

settings = Settings()
