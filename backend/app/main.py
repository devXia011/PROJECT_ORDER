from fastapi import FastAPI
from fastapi.responses import FileResponse

from backend.app import routes_auth
from backend.app import routes_store

import os

app = FastAPI()

@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))

# Include your existing auth routes
app.include_router(routes_auth.router)

# Include the new store routes
app.include_router(routes_store.router)
