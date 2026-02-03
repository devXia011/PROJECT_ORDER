from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from backend.app import routes_auth

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <html>
        <head><title>FastAPI Demo</title></head>
        <body>
            <h1>Hello, FastAPI is working!</h1>
            <p>Try POST /login with username and password.</p>
        </body>
    </html>
    """

app.include_router(routes_auth.router)s