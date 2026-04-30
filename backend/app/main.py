from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import router module safely
import app.api.v1.router as router_module

# Extract router (prevents Pylance issues)
api_router = router_module.api_router

# =====================================
# APP INIT
# =====================================
app = FastAPI(
    title="News AI System",
    version="1.0.0",
    description="AI-powered News Intelligence Backend"
)

# =====================================
# ROUTERS
# =====================================
# All APIs under /api/v1
app.include_router(api_router, prefix="/api/v1")

# =====================================
# ROOT + HEALTH CHECK
# =====================================
@app.get("/")
def root():
    return {
        "message": "News AI Backend Running",
        "status": "ok"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

# =====================================
# CORS CONFIG
# =====================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)