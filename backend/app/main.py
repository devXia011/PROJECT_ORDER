from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse
from backend.app import routes_auth
import os


app = FastAPI()

app = FastAPI()

@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))


app.include_router(routes_auth.router)