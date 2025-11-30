from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "GigFin Backend is running!"}

# Example User Profile Endpoint
class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    role: str

@app.get("/api/users/me")
def get_current_user():
    # Mock data for now
    return {
        "id": 1,
        "name": "Adeen",
        "email": "adeen@gigfin.app",
        "role": "Gig Worker"
    }
