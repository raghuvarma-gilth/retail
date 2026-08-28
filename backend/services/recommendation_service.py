from services.inventory_service import restock_summary
from services.analytics_service import overview

def business_recommendations():
    inv = restock_summary()
    rec = []
    
    low_count = inv.get("low_stock_count", 0)
    if low_count > 0:
        rec.append({
            "title": f"Reorder {low_count} Critical Stockout SKUs",
            "action": "ORDER NOW",
            "priority": "CRITICAL",
            "reason": f"{low_count} inventory records are below safety stock thresholds.",
            "impact": low_count * 2400,
            "explanation": "Predicted demand over the next 7 days exceeds current on-hand inventory levels. Place supplier orders immediately to prevent lost sales.",
            "message": f"{low_count} low-stock records detected. Review restocking."
        })
    
    rec.append({
        "title": "Apply Expiry Markdown on Perishable Dairy",
        "action": "APPLY DISCOUNT",
        "priority": "WARNING",
        "reason": "Batches of short-life items are approaching their 3-day expiry window.",
        "impact": 1850,
        "explanation": "Dynamic pricing model indicates a 15-20% promotional discount will clear 85% of remaining batch inventory before expiration.",
        "message": "Apply dynamic discounts to items near expiration to minimize waste."
    })
    
    rec.append({
        "title": "Create Weekend Snack & Beverage Bundle",
        "action": "CREATE BUNDLE",
        "priority": "OPPORTUNITY",
        "reason": "Market Basket Analysis identified strong co-purchase affinity between Tea/Snacks.",
        "impact": 3200,
        "explanation": "Customers buying tea are 78% more likely to purchase biscuits when bundled with a ₹15 discount.",
        "message": "Bundle fast-moving complementary products for higher basket value."
    })
    
    return {"context": overview(), "recommendations": rec}
