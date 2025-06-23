
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str = "postgresql://neondb_owner:npg_we1Il4jBnHcq@ep-silent-glitter-a1q3ifd9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    openai_api_key: Optional[str] = None
    google_ai_api_key: Optional[str] = None
    serpapi_api_key: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
