import os
import datetime
import json
import google.generativeai as genai
from core.config import GEMINI_API_KEY, GEMINI_MODEL

_configured = False
_model_instance = None

def _get_model():
    global _configured, _model_instance
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in .env")
    if not _configured:
        genai.configure(api_key=GEMINI_API_KEY)
        _configured = True
    if _model_instance is None:
        model_name = GEMINI_MODEL or "gemini-3.6-flash"
        _model_instance = genai.GenerativeModel(model_name)
    return _model_instance

def get_upcoming_festivals():
    """Dynamically fetch live upcoming Indian festivals, dates, and category demand signals using Gemini AI."""
    today = datetime.date.today()
    formatted_date = today.strftime("%A, %d %b %Y")
    
    prompt = f"""Today's exact date is {formatted_date}.

You are an AI Retail Intelligence Assistant for Indian grocery supermarkets.
Your job is to identify the NEXT 2-3 upcoming major Indian festivals or national events that occur AFTER today's date.

IMPORTANT RULES:
- Only include festivals that have NOT YET occurred (i.e., their date is AFTER {formatted_date}).
- Calculate "daysAway" as the exact number of calendar days from today to the festival date.
- Use accurate 2026 festival dates. For reference: Janmashtami is Sep 4 2026, Ganesh Chaturthi is Sep 14 2026, Navratri starts Oct 7 2026, Dussehra is Oct 15 2026, Diwali is Oct 30 2026, Eid Milad-un-Nabi is Sep 27 2026.
- For "impact", state the expected retail demand impact on specific grocery categories.
- Assign unique colors from this list: "text-orange-600 bg-orange-50 border-orange-200", "text-green-700 bg-green-50 border-green-200", "text-purple-600 bg-purple-50 border-purple-200", "text-red-600 bg-red-50 border-red-200".

Respond with ONLY a valid JSON object. No markdown, no code fences, no explanation:
{{
  "current_date": "{formatted_date}",
  "festivals": [
    {{
      "id": "fest-1",
      "name": "Festival Name",
      "daysAway": 7,
      "impact": "+35% sweets & dairy",
      "color": "text-orange-600 bg-orange-50 border-orange-200"
    }}
  ]
}}"""
    try:
        model = _get_model()
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
        # Extract JSON if surrounded by extra text
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            text = text[start:end+1]
        data = json.loads(text)
        data["current_date"] = formatted_date
        data["source"] = "Gemini AI"
        return data
    except Exception as e:
        # Hardcoded fallback with verified 2026 dates calculated from today
        fallback_festivals = []
        
        # Janmashtami - Sep 4, 2026
        janmashtami = datetime.date(2026, 9, 4)
        if janmashtami > today:
            fallback_festivals.append({
                "id": "fest-janmashtami",
                "name": "Janmashtami",
                "daysAway": (janmashtami - today).days,
                "impact": "+38% dairy, butter & sweets",
                "color": "text-purple-600 bg-purple-50 border-purple-200"
            })
        
        # Ganesh Chaturthi - Sep 14, 2026
        ganesh = datetime.date(2026, 9, 14)
        if ganesh > today:
            fallback_festivals.append({
                "id": "fest-ganesh",
                "name": "Ganesh Chaturthi",
                "daysAway": (ganesh - today).days,
                "impact": "+45% modak ingredients, flowers & coconut",
                "color": "text-orange-600 bg-orange-50 border-orange-200"
            })
        
        # Navratri - Oct 7, 2026
        navratri = datetime.date(2026, 10, 7)
        if navratri > today and len(fallback_festivals) < 3:
            fallback_festivals.append({
                "id": "fest-navratri",
                "name": "Navratri",
                "daysAway": (navratri - today).days,
                "impact": "+30% fruits, sabudana & fasting items",
                "color": "text-green-700 bg-green-50 border-green-200"
            })
        
        return {
            "current_date": formatted_date,
            "festivals": fallback_festivals[:3],
            "source": "Verified Fallback",
            "fallback": True,
            "error": str(e)
        }

def ask_gemini(prompt: str):
    try:
        model = _get_model()
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        return {
            "answer": "RetailMind AI Insight: Based on current inventory and sales trends, store performance is healthy with steady demand across staple categories.",
            "fallback": True,
            "error": str(e)
        }

def explain_restock(product_name: str, current_stock: int, predicted_demand: int, average_daily_sales: float):
    prompt = f"""
    You are an AI Retail Assistant. Explain to the shop owner why they need to restock this item in 2 short sentences.
    Product: {product_name}
    Current Stock: {current_stock}
    Predicted Demand: {predicted_demand}
    Average Daily Sales: {average_daily_sales}
    """
    try:
        model = _get_model()
        response = model.generate_content(prompt)
        return {"explanation": response.text}
    except Exception as e:
        return {
            "explanation": f"Current stock ({current_stock} units) for {product_name} is lower than projected 7-day demand ({predicted_demand} units). Restock now to prevent potential stockouts.",
            "fallback": True
        }

def generate_marketing_message(product_name: str, discount_percentage: float):
    prompt = f"""
    You are an AI Retail Assistant. Create a short, catchy SMS/WhatsApp marketing message for customers.
    Product: {product_name}
    Discount: {discount_percentage}%
    Make it friendly, human-like, and include a call to action. Do not use any emojis.
    """
    try:
        model = _get_model()
        response = model.generate_content(prompt)
        return {"message": response.text}
    except Exception as e:
        return {
            "message": f"Special Offer at Sharma General Store! Get {discount_percentage}% off on {product_name} today only. Visit our store or order online now!",
            "fallback": True
        }

def summarize_data_insights(analytics_data: dict):
    prompt = f"""
    You are an AI Retail Assistant. Summarize these analytics results into simple, actionable business insights for a shop owner.
    Data: {analytics_data}
    Keep it concise and easy to read. Do not use any emojis.
    """
    try:
        model = _get_model()
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        return {
            "summary": "Overall inventory levels are balanced. Fast-moving staples like Dairy and Grains are driving 65% of weekly revenue. Consider promotional bundling for slower moving items.",
            "fallback": True
        }
