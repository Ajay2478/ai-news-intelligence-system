from fastapi import APIRouter

# Import endpoint modules
from app.api.v1.endpoints import news

# Create main API router
api_router = APIRouter()

# Register news routes
api_router.include_router(
    news.router,
    prefix="/news",
)