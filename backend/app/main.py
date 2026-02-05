from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app import routes_auth, routes_store
import os

app = FastAPI()

# Serve static assets (JS, CSS, images) under /static
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve index.html at root
@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))

# Include your API routers
app.include_router(routes_auth.router)
app.include_router(routes_store.router)