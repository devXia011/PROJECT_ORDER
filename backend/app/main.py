from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app import routes_auth, routes_store, routes_app
import os
import pathlib

app = FastAPI()

# Serve static assets (JS, CSS, images) under /static
app.mount("/static", StaticFiles(directory="frontend"), name="static")




# DEV: disbables caching for static files to ensure latest versions are always loaded
@app.middleware("http")
async def no_cache_static(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static/"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# PROD: enables caching for static files to improve performance, redownload every 24 hours
# @app.middleware("http")
# async def cache_static_daily(request, call_next):
#     response = await call_next(request)
#     if request.url.path.startswith("/static/"):
#         # Cache for 1 day (86400 seconds)
#         response.headers["Cache-Control"] = "public, max-age=86400"
#     return response


# Serve index.html at root
@app.get("/")
def serve_index():
    return FileResponse(os.path.join("frontend", "index.html"))

# Include your API routers

app.include_router(routes_store.router) 

app.include_router(routes_auth.router)

app.include_router(routes_app.router)

