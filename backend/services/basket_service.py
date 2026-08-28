import json, os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BASKET_RULES_PATH = BASE_DIR / "ml" / "basket_rules.json"
PRODUCT_POPULARITY_PATH = BASE_DIR / "ml" / "product_popularity.json"

_rules = None
_popularity = None

def _load_rules():
    global _rules
    if _rules is None:
        if BASKET_RULES_PATH.exists():
            with open(BASKET_RULES_PATH, "r") as f:
                _rules = json.load(f)
        else:
            _rules = []
    return _rules

def _load_popularity():
    global _popularity
    if _popularity is None:
        if PRODUCT_POPULARITY_PATH.exists():
            with open(PRODUCT_POPULARITY_PATH, "r") as f:
                _popularity = json.load(f)
        else:
            _popularity = {}
    return _popularity

def get_basket_recommendations(product_name: str, top_n: int = 5):
    rules = _load_rules()
    product_lower = product_name.lower().strip()

    matching_rules = []
    for rule in rules:
        antecedents = rule.get("antecedents", rule.get("antecedent", []))
        if isinstance(antecedents, str):
            antecedents = [antecedents]
        if any(product_lower in a.lower() for a in antecedents):
            consequents = rule.get("consequents", rule.get("consequent", []))
            if isinstance(consequents, str):
                consequents = [consequents]
            matching_rules.append({
                "recommended_products": consequents,
                "support": rule.get("support", 0),
                "confidence": rule.get("confidence", 0),
                "lift": rule.get("lift", 0),
            })

    matching_rules.sort(key=lambda x: x.get("lift", 0), reverse=True)

    if matching_rules:
        return {
            "product": product_name,
            "recommendations": matching_rules[:top_n],
            "recommendation_source": "FP-Growth Association Rules",
            "total_rules_matched": len(matching_rules),
        }

    # Fallback to popularity
    popularity = _load_popularity()
    if isinstance(popularity, list):
        popular = popularity[:top_n]
    elif isinstance(popularity, dict):
        sorted_items = sorted(popularity.items(), key=lambda x: x[1], reverse=True)
        popular = [{"product": k, "score": v} for k, v in sorted_items[:top_n]]
    else:
        popular = []

    return {
        "product": product_name,
        "recommendations": popular,
        "recommendation_source": "Product Popularity Fallback",
        "total_rules_matched": 0,
    }
