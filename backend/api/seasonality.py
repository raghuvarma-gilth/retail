from fastapi import APIRouter
from services.seasonality_service import seasonality_analysis
router=APIRouter(prefix='/seasonality',tags=['Seasonality'])
@router.get('/')
def get(): return seasonality_analysis()
