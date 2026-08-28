import json, joblib, pandas as pd
from core.config import FORECAST_MODEL_PATH, FEATURE_COLUMNS_PATH
from services.gemini_service import ask_gemini

_model = None
def load_model():
    global _model
    if _model is None:
        if not FORECAST_MODEL_PATH.exists():
            raise FileNotFoundError(f"Model not found: {FORECAST_MODEL_PATH}")
        _model = joblib.load(FORECAST_MODEL_PATH)
    return _model

def predict(features: dict):
    try:
        model = load_model()
        if FEATURE_COLUMNS_PATH.exists():
            cols = json.loads(FEATURE_COLUMNS_PATH.read_text())
            X = pd.DataFrame([[features.get(c, 0) for c in cols]], columns=cols)
        else:
            X = pd.DataFrame([features])
        value = model.predict(X)[0]
        return {"predicted_demand": float(value), "source": "XGBoost Regressor"}
    except Exception as e:
        # Fallback to Gemini
        print(f"XGBoost prediction failed: {e}. Falling back to Gemini API.")
        
        inventory = features.get('inventory_level', 20)
        price = features.get('price', 100)
        month = features.get('month', 1)
        
        prompt = f"""
        You are an AI Retail Forecaster. The ML model is offline, so you need to estimate the 7-day demand.
        The product has a current inventory of {inventory}, price is {price}, and we are in month {month}.
        Respond with ONLY a number representing the estimated units to order (between 10 and 200). Do not write anything else.
        """
        
        try:
            gemini_response = ask_gemini(prompt)
            demand_val = float(''.join(c for c in gemini_response.get("answer", "50") if c.isdigit() or c == '.'))
            if demand_val <= 0: demand_val = 45.0
            return {"predicted_demand": demand_val, "source": "Gemini 3.6 Flash (AI Fallback)"}
        except Exception as gemini_e:
            print(f"Gemini fallback failed: {gemini_e}")
            return {"predicted_demand": 45.0, "source": "Static Rule (Fallback)"}
