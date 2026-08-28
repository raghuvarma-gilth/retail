import json, os
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/system", tags=["system"])

BASE_DIR = Path(__file__).resolve().parent.parent

@router.get("/status")
def system_status():
    services = {}

    # FastAPI status
    services["fastapi"] = True

    # XGBoost forecast model file check (lightweight, no memory allocation)
    model_path = BASE_DIR / "ml" / "forecast_model.pkl"
    try:
        services["xgboost_model"] = model_path.exists() and model_path.stat().st_size > 50
    except Exception as e:
        services["xgboost_model"] = {"status": False, "error": str(e)}

    # FP-Growth rules file check
    rules_path = BASE_DIR / "ml" / "basket_rules.json"
    try:
        services["fp_growth_rules"] = rules_path.exists() and rules_path.stat().st_size > 0
    except Exception as e:
        services["fp_growth_rules"] = {"status": False, "error": str(e)}

    # Product popularity
    pop_path = BASE_DIR / "ml" / "product_popularity.json"
    services["product_popularity"] = pop_path.exists()

    # Hugging Face embeddings availability check
    embeddings_path = BASE_DIR / "ml" / "product_embeddings.pkl"
    services["huggingface_model"] = embeddings_path.exists()

    # Gemini API key check
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    if gemini_key and gemini_key != "your-gemini-api-key-here":
        services["gemini_api"] = True
    else:
        services["gemini_api"] = {"status": False, "error": "GEMINI_API_KEY is missing or not configured"}

    # Weather API key check
    weather_key = os.getenv("WEATHER_API_KEY", "")
    if weather_key and weather_key != "your-weather-api-key-here":
        services["weather_api"] = True
    else:
        services["weather_api"] = {"status": False, "error": "WEATHER_API_KEY is missing or not configured"}

    # Firebase configuration check
    firebase_project = os.getenv("FIREBASE_PROJECT_ID", "")
    services["firebase_configuration"] = bool(firebase_project)

    all_healthy = all(
        (v is True if isinstance(v, bool) else v.get("status", False) if isinstance(v, dict) else False)
        for v in services.values()
    )

    return {
        "status": "healthy" if all_healthy else "degraded",
        "services": services,
    }
