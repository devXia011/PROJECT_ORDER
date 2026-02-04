from fastapi import APIRouter

router = APIRouter(prefix="/s", tags=["store"])

@router.get("/{store_name}")
def get_store(store_name: str):
    return {"store": store_name, "message": f"Welcome to {store_name}"}

@router.get("/{store_name}/menu")
def get_store_menu(store_name: str):
    # Example: return menu items for this store
    return {
        "store": store_name,
        "menu": ["Coffee", "Sandwich", "Salad"]
    }