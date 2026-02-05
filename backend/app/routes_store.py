from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter(tags=["store"])

@router.get("/{store_name}")
def get_store(store_name: str):
    # Always serve index.html, Vue will handle rendering
    return FileResponse(os.path.join("frontend", "index.html"))

@router.get("/{store_name}/menu")
def get_store_menu(store_name: str):
    # Same: serve index.html, Vue Router decides what to show
    return FileResponse(os.path.join("frontend", "index.html"))