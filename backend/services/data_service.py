import pandas as pd
from functools import lru_cache
from core.config import DATASET_PATH

@lru_cache(maxsize=1)
def get_data():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)
    df.columns = [str(c).strip() for c in df.columns]
    return df

def columns():
    return list(get_data().columns)

def find_column(candidates):
    df = get_data()
    lower = {c.lower().replace(" ", "_"): c for c in df.columns}
    for name in candidates:
        if name in lower:
            return lower[name]
    return None

def numeric_summary():
    df = get_data()
    return df.select_dtypes(include="number").describe().fillna(0).to_dict()
