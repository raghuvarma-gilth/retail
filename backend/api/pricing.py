from fastapi import APIRouter
from services.pricing_service import price_analysis
router=APIRouter(prefix='/pricing',tags=['Pricing'])
@router.get('/')
def get(): return price_analysis()
