from fastapi import APIRouter
from services.promotion_service import promotion_analysis
router=APIRouter(prefix='/promotion',tags=['Promotion'])
@router.get('/')
def get(): return promotion_analysis()
