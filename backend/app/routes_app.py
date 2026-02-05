from fastapi import APIRouter
from fastapi.responses import FileResponse
import os


router = APIRouter()

@router.get("/dashboard")
def get_store(store_name: str):
    # Always serve index.html, Vue will handle rendering
    return FileResponse(os.path.join("frontend", "index.html"))