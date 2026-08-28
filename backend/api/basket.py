from fastapi import APIRouter, Query
from services.basket_service import get_basket_recommendations

router = APIRouter(prefix="/basket", tags=["basket"])

@router.get("/recommendations")
def basket_recommendations(product: str = Query(..., description="Product name to find recommendations for"), top_n: int = Query(5, ge=1, le=20)):
    return get_basket_recommendations(product, top_n)
