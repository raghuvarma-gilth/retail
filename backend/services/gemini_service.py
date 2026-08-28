import google.generativeai as genai
from core.config import GEMINI_API_KEY, GEMINI_MODEL

def _get_model():
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in .env")
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel(GEMINI_MODEL)

def ask_gemini(prompt: str):
    try:
        model = _get_model()
        return {"answer": model.generate_content(prompt).text}
    except Exception as e:
        return {"answer": f"Gemini error: {e}"}

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
        return {"explanation": model.generate_content(prompt).text}
    except Exception as e:
        return {"explanation": f"Error generating explanation: {e}"}

def generate_marketing_message(product_name: str, discount_percentage: float):
    prompt = f"""
    You are an AI Retail Assistant. Create a short, catchy SMS/WhatsApp marketing message for customers.
    Product: {product_name}
    Discount: {discount_percentage}%
    Make it friendly, human-like, and include a call to action. Do not use any emojis.
    """
    try:
        model = _get_model()
        return {"message": model.generate_content(prompt).text}
    except Exception as e:
        return {"message": f"Error generating message: {e}"}

def summarize_data_insights(analytics_data: dict):
    prompt = f"""
    You are an AI Retail Assistant. Summarize these analytics results into simple, actionable business insights for a shop owner.
    Data: {analytics_data}
    Keep it concise and easy to read. Do not use any emojis.
    """
    try:
        model = _get_model()
        return {"summary": model.generate_content(prompt).text}
    except Exception as e:
        return {"summary": f"Error generating summary: {e}"}
