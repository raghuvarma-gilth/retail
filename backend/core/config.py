from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATASET_PATH = BASE_DIR / os.getenv("DATASET_PATH", "data/retail_store_inventory.csv")
FORECAST_MODEL_PATH = BASE_DIR / os.getenv("FORECAST_MODEL_PATH", "ml/forecast_model.pkl")
FEATURE_COLUMNS_PATH = BASE_DIR / "ml/feature_columns.json"
ENCODERS_PATH = BASE_DIR / "ml/category_encoders.json"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")
