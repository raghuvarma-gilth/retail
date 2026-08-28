"""
Retrain XGBoost forecast model on a synthetic retail dataset.
Generates 1000+ rows, engineers temporal features, trains XGBoost, saves model + feature columns.
"""
import pandas as pd
import numpy as np
import json, joblib, os
from pathlib import Path

np.random.seed(42)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
ML_DIR = BASE_DIR / "ml"
os.makedirs(ML_DIR, exist_ok=True)

# ---------- 1. Generate synthetic retail dataset ----------
print("[1/4] Generating synthetic retail dataset...")

dates = pd.date_range("2024-01-01", "2026-08-22", freq="D")
products = [
    ("P001", "Amul Taaza Toned Milk 1L", "Dairy", 58),
    ("P002", "Britannia Good Day 600g", "Snacks", 120),
    ("P003", "Aashirvaad Atta 5kg", "Staples", 248),
    ("P004", "Maggi 2-Minute Noodles", "Snacks", 48),
    ("P005", "Tata Salt 1kg", "Staples", 22),
    ("P006", "Coca-Cola 600ml", "Beverages", 40),
    ("P007", "Parle-G 800g", "Snacks", 65),
    ("P008", "Surf Excel 1kg", "Cleaning", 220),
    ("P009", "Amul Butter 500g", "Dairy", 275),
    ("P010", "Red Label Tea 500g", "Beverages", 255),
]

rows = []
for date in dates:
    for pid, pname, category, price in products:
        base_demand = np.random.randint(20, 80)
        # Weekend boost
        if date.dayofweek >= 5:
            base_demand = int(base_demand * 1.3)
        # Seasonal effect
        if date.month in [10, 11, 12]:  # festival season
            base_demand = int(base_demand * 1.4)
        if date.month in [6, 7, 8]:  # monsoon
            base_demand = int(base_demand * 1.15)
        # Random noise
        units_sold = max(1, base_demand + np.random.randint(-10, 10))
        
        rows.append({
            "date": date.strftime("%Y-%m-%d"),
            "store_id": 1,
            "product_id": pid,
            "product_name": pname,
            "category": category,
            "region": "South",
            "inventory_level": np.random.randint(50, 300),
            "units_sold": units_sold,
            "units_ordered": units_sold + np.random.randint(0, 20),
            "demand_forecast": units_sold + np.random.randint(-5, 5),
            "price": price,
            "discount": round(np.random.choice([0, 0, 0, 5, 10, 15, 20]), 1),
            "weather_condition": np.random.choice(["Sunny", "Cloudy", "Rainy", "Stormy"]),
            "holiday/promotion": np.random.choice([0, 0, 0, 1]),
            "competitor_pricing": round(price * np.random.uniform(0.9, 1.1), 2),
            "seasonality": "High" if date.month in [10, 11, 12] else ("Medium" if date.month in [6, 7, 8] else "Low"),
        })

df = pd.DataFrame(rows)
df.to_csv(DATA_DIR / "retail_store_inventory.csv", index=False)
print(f"   Dataset: {len(df)} rows, {len(df.columns)} columns saved.")

# ---------- 2. Feature Engineering ----------
print("[2/4] Engineering features...")

df["date"] = pd.to_datetime(df["date"])
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["day_of_week"] = df["date"].dt.dayofweek
df["week_of_year"] = df["date"].dt.isocalendar().week.astype(int)
df["quarter"] = df["date"].dt.quarter
df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
df["day_of_week_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
df["day_of_week_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

# Encode categoricals
weather_map = {"Sunny": 0, "Cloudy": 1, "Rainy": 2, "Stormy": 3}
season_map = {"Low": 0, "Medium": 1, "High": 2}
df["weather_encoded"] = df["weather_condition"].map(weather_map).fillna(0)
df["seasonality_encoded"] = df["seasonality"].map(season_map).fillna(0)

# Lag features (per product)
df = df.sort_values(["product_id", "date"])
for lag in [1, 3, 7]:
    df[f"sales_lag_{lag}"] = df.groupby("product_id")["units_sold"].shift(lag)

# Rolling averages
df["sales_rolling_7"] = df.groupby("product_id")["units_sold"].transform(lambda x: x.rolling(7, min_periods=1).mean())
df["sales_rolling_14"] = df.groupby("product_id")["units_sold"].transform(lambda x: x.rolling(14, min_periods=1).mean())

# Drop NaN rows from lags
df = df.dropna()

# ---------- 3. Train XGBoost ----------
print("[3/4] Training XGBoost model...")

feature_cols = [
    "year", "month", "day", "day_of_week", "week_of_year", "quarter",
    "is_weekend", "month_sin", "month_cos", "day_of_week_sin", "day_of_week_cos",
    "inventory_level", "price", "discount", "holiday/promotion", "competitor_pricing",
    "weather_encoded", "seasonality_encoded",
    "sales_lag_1", "sales_lag_3", "sales_lag_7",
    "sales_rolling_7", "sales_rolling_14"
]

X = df[feature_cols]
y = df["units_sold"]

from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"   MAE: {mae:.2f}, RMSE: {rmse:.2f}")

# ---------- 4. Save ----------
print("[4/4] Saving model and feature columns...")

joblib.dump(model, ML_DIR / "forecast_model.pkl")
with open(ML_DIR / "feature_columns.json", "w") as f:
    json.dump(feature_cols, f)

print("DONE! Model saved to ml/forecast_model.pkl")
print(f"Feature columns ({len(feature_cols)}): {feature_cols}")
