from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from services.gemini_service import ask_gemini, explain_restock, generate_marketing_message, summarize_data_insights
from services.huggingface_service import semantic_search, similar_product_search

router = APIRouter(prefix="/ai", tags=["AI"])

class Prompt(BaseModel): 
    prompt: str

class RestockContext(BaseModel):
    product_name: str
    current_stock: int
    predicted_demand: int
    average_daily_sales: float

class MarketingContext(BaseModel):
    product_name: str
    discount_percentage: float

class AnalyticsContext(BaseModel):
    data: Dict[str, Any]

@router.post("/ask")
def ask(x: Prompt): 
    return ask_gemini(x.prompt)

@router.post("/explain/restock")
def explain_restock_endpoint(ctx: RestockContext):
    return explain_restock(ctx.product_name, ctx.current_stock, ctx.predicted_demand, ctx.average_daily_sales)

@router.post("/explain/marketing")
def generate_marketing_endpoint(ctx: MarketingContext):
    return generate_marketing_message(ctx.product_name, ctx.discount_percentage)

@router.post("/explain/analytics")
def summarize_analytics_endpoint(ctx: AnalyticsContext):
    return summarize_data_insights(ctx.data)

@router.get("/search")
def search(q: str, top_n: int = 5):
    return {"results": semantic_search(q, top_n)}

@router.get("/similar-product")
def similar_product(product: str, top_n: int = 5):
    return similar_product_search(product, top_n)
