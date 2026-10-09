import datetime
import json
import requests
from core.config import GROQ_API_KEY

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "qwen/qwen3.6-27b"

def _call_groq(prompt: str) -> str:
    """Call Groq API (OpenAI-compatible) with the given prompt."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not configured in .env")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 1024,
    }
    
    response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=15)
    response.raise_for_status()
    data = response.json()
    text = data["choices"][0]["message"]["content"].strip()
    
    # Strip <think> blocks which Qwen models generate
    if "<think>" in text:
        if "</think>" in text:
            text = text.split("</think>")[-1].strip()
        else:
            # Output truncated while thinking. Try to extract any JSON or fallback
            text = ""
            
    if not text.strip():
        raise ValueError("Model produced only thinking block or empty output.")
        
    return text


def get_upcoming_festivals():
    """Dynamically fetch live upcoming Indian festivals using Groq API (ultra-fast inference)."""
    today = datetime.date.today()
    formatted_date = today.strftime("%A, %d %b %Y")
    
    prompt = f"""Today's date is {formatted_date}.
You are an AI Retail Intelligence Assistant for Indian grocery stores.
Identify 2-3 upcoming major Indian festivals or national retail shopping events occurring in the next 1-4 weeks after {formatted_date}.
For each festival, calculate the exact number of days from today, and state the expected retail category demand impact (e.g., "+35% sweets & dairy").

DO NOT output any thinking blocks like <think>. ONLY output a raw JSON object matching exactly this schema:
{{
  "current_date": "{formatted_date}",
  "festivals": [
    {{
      "id": "fest-1",
      "name": "Festival Name",
      "daysAway": 9,
      "impact": "+35% category impact",
      "color": "text-orange-600 bg-orange-50 border-orange-200"
    }}
  ]
}}"""

    try:
        text = _call_groq(prompt)
        # Extract JSON using regex if there's surrounding text
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            text = text[start:end+1]
            
        data = json.loads(text)
        data["current_date"] = formatted_date
        data["source"] = "Groq AI"
        return data
    except Exception as e:
        # Graceful fallback with hardcoded sensible defaults - ONLY FUTURE FESTIVALS
        fallback_festivals = []
        
        # Dussehra - Oct 15, 2026
        dussehra = datetime.date(2026, 10, 15)
        if dussehra > today:
            fallback_festivals.append({
                "id": "fest-dussehra",
                "name": "Dussehra",
                "daysAway": (dussehra - today).days,
                "impact": "+28% sweets, dry fruits & household essentials",
                "color": "text-red-600 bg-red-50 border-red-200"
            })
        
        # Diwali - Oct 30, 2026
        diwali = datetime.date(2026, 10, 30)
        if diwali > today:
            fallback_festivals.append({
                "id": "fest-diwali",
                "name": "Diwali",
                "daysAway": (diwali - today).days,
                "impact": "+42% sweets, diyas, gifting & home supplies",
                "color": "text-orange-600 bg-orange-50 border-orange-200"
            })
        
        # Eid Milad-un-Nabi - Sep 27, 2026
        eid = datetime.date(2026, 9, 27)
        if eid > today and len(fallback_festivals) < 3:
            fallback_festivals.append({
                "id": "fest-eid",
                "name": "Eid Milad-un-Nabi",
                "daysAway": (eid - today).days,
                "impact": "+25% biryani ingredients, dry fruits & sweets",
                "color": "text-green-700 bg-green-50 border-green-200"
            })
        
        return {
            "current_date": formatted_date,
            "festivals": fallback_festivals,
            "source": "Static Fallback",
            "fallback": True,
            "error": str(e)
        }


def get_realtime_greeting():
    """Generate a time-aware greeting and store context using Groq."""
    now = datetime.datetime.now()
    formatted_date = now.strftime("%A, %d %b %Y")
    hour = now.hour
    
    if hour < 12:
        greeting = "Good Morning"
    elif hour < 17:
        greeting = "Good Afternoon"
    else:
        greeting = "Good Evening"
    
    prompt = f"""Today is {formatted_date}, time is {now.strftime('%I:%M %p')}.
You are an AI Retail Assistant. Generate a 1-sentence actionable store insight for a grocery store owner.
Keep it under 15 words, data-driven, and no emojis. Respond with ONLY the insight text. DO NOT output any <think> block or thinking process."""

    try:
        insight = _call_groq(prompt)
        return {
            "greeting": greeting,
            "date": formatted_date,
            "time": now.strftime("%I:%M %p"),
            "insight": insight,
            "source": "Groq AI"
        }
    except Exception:
        return {
            "greeting": greeting,
            "date": formatted_date,
            "time": now.strftime("%I:%M %p"),
            "insight": "3 critical actions require attention",
            "source": "Static Fallback"
        }
