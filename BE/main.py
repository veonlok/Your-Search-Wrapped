import sys
import os
from pathlib import Path

# Add BE directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.endpoints import SearchRouter
import os
from dotenv import load_dotenv
from pathlib import Path

ENV_FILE = os.getenv("ENV_FILE", ".env.local")

env_path = Path(__file__).resolve().parent / ENV_FILE
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

CLIENT_URL = os.getenv("VITE_CLIENT_URL")

# Remove trailing slash from CLIENT_URL if it exists
if CLIENT_URL and CLIENT_URL.endswith('/'):
    CLIENT_URL = CLIENT_URL.rstrip('/')

if CLIENT_URL:
    allowed_origins = [CLIENT_URL]
else:
    allowed_origins = [
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",
    ]

print(f"CORS allowed origins: {allowed_origins}")

app = FastAPI()

# Debug middleware to see what's happening
@app.middleware("http") 
async def debug_cors(request, call_next):
    origin = request.headers.get("origin")
    print(f"Request origin: {origin}")
    print(f"Allowed origins: {allowed_origins}")
    print(f"Origin matches: {origin in allowed_origins}")
    
    response = await call_next(request)
    
    cors_header = response.headers.get("access-control-allow-origin")
    print(f"CORS header set: {cors_header}")
    print("---")
    
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https:\/\/eagle-eye-intelligence(-[a-z0-9]+)?-veon-loks-projects\.vercel\.app|https:\/\/eagle-eye-intelligence\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Added OPTIONS and other methods
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With", "Access-Control-Allow-Origin"],
)

app.include_router(SearchRouter, prefix="/api/v1/search")
# app.include_router(portfolioRouter, prefix="/api/v1/portfolio")

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)