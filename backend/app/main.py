from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app import routes_auth

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(routes_auth.router)