import json, os
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/system", tags=["system"])

BASE_DIR = Path(__file__).resolve().parent.parent

@router.get("/status")
def system_status():
    services = {}

    # FastAPI
    services["fastapi"] = True

    # XGBoost model
    model_path = BASE_DIR / "ml" / "forecast_model.pkl"
    try:
        if model_path.exists() and model_path.stat().st_size > 50:
            import joblib
            joblib.load(model_path)
            services["xgboost_model"] = True
        else:
            services["xgboost_model"] = False
    except Exception as e:
        services["xgboost_model"] = {"status": False, "error": str(e)}

    # FP-Growth rules
    rules_path = BASE_DIR / "ml" / "basket_rules.json"
    try:
        if rules_path.exists():
            with open(rules_path) as f:
                rules = json.load(f)
            services["fp_growth_rules"] = True
        else:
            services["fp_growth_rules"] = False
    except Exception as e:
        services["fp_growth_rules"] = {"status": False, "error": str(e)}

    # Product popularity
    pop_path = BASE_DIR / "ml" / "product_popularity.json"
    services["product_popularity"] = pop_path.exists()

    # Hugging Face model
    try:
        from services.huggingface_service import get_model
        get_model()
        services["huggingface_model"] = True
    except Exception as e:
        services["huggingface_model"] = {"status": False, "error": str(e)}

    # Gemini API
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    if gemini_key and gemini_key != "your-gemini-api-key-here":
        services["gemini_api"] = True
    else:
        services["gemini_api"] = {"status": False, "error": "GEMINI_API_KEY is missing or not configured"}

    # Weather API
    weather_key = os.getenv("WEATHER_API_KEY", "")
    if weather_key and weather_key != "your-weather-api-key-here":
        services["weather_api"] = True
    else:
        services["weather_api"] = {"status": False, "error": "WEATHER_API_KEY is missing or not configured"}

    # Firebase
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
