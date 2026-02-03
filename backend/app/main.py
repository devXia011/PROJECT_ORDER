from fastapi import FastAPI

# Create the FastAPI app instance
app = FastAPI()

# Define a simple route
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}

# Another test route
@app.get("/test")
def test_route():
    return {"status": "success", "detail": "This is a test endpoint"}