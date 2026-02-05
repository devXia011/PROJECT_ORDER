from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/s", tags=["store"])

@router.get("/{store_name}")
def get_store(store_name: str):
    # Always serve index.html, Vue will handle rendering
    return FileResponse(os.path.join("frontend", "index.html"))

@router.get("/{store_name}/menu")
def serve_store_menu_page(store_name: str):
    return FileResponse(os.path.join("frontend", "index.html"))

# --- API route: return dummy JSON data ---
@router.get("/{store_name}/menulist")
def get_store_menu(store_name: str):
    dummy_menus = {
        "starbucks": ["Latte", "Espresso", "Cappuccino"],
        "subway": ["Sandwich", "Salad", "Wrap"],
    }
    return {
        "store": store_name,
        "menu": dummy_menus.get(store_name.lower(), ["No items available"])
    }
