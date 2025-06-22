from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine, Base

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Workflow Builder API",
    description="API for building and executing AI workflows",
    version="1.0.0"
)

# CORS settings
origins = [
    "http://localhost:3000",  # React (default)
    "http://localhost:5173",  # Vite
    "http://localhost:8080",  # Your frontend
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health check route
@app.get("/")
def read_root():
    return {"message": "Workflow Builder API is running"}

# Run with Uvicorn if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
