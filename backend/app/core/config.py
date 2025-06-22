
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:password@localhost:5432/workflow_db"
    openai_api_key: Optional[str] = None
    google_ai_api_key: Optional[str] = None
    serpapi_api_key: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
