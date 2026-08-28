import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import (
    health, forecast, inventory, analytics, pricing,
    promotion, weather, seasonality, anomaly,
    recommendations, ai, basket, status
)

app = FastAPI(
    title="Retail Intelligence API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for all frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:4028", 
        "http://127.0.0.1:4028",
        "https://retailmind8214.builtwithrocket.new"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routers
for router in [
    health.router,
    forecast.router,
    inventory.router,
    analytics.router,
    pricing.router,
    promotion.router,
    weather.router,
    seasonality.router,
    anomaly.router,
    recommendations.router,
    ai.router,
    basket.router,
    status.router,
]:
    app.include_router(router)

@app.get("/")
def root():
    return {
        "message": "Retail Intelligence Backend is running",
        "health": "/health/",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
