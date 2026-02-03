from fastapi import FastAPI
from fastapi.responses import FileResponse
from backend.app import routes_auth
import os

app = FastAPI()

# Serve index.html at root
@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))

# Include JWT routes
app.include_router(routes_auth.router)