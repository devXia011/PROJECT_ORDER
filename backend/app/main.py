from fastapi import FastAPI
from backend.app import routes_auth

app = FastAPI()

# Include authentication routes
app.include_router(routes_auth.router)