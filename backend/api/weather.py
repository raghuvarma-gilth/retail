from fastapi import APIRouter
from services.weather_service import weather_analysis
router=APIRouter(prefix='/weather',tags=['Weather'])
@router.get('/analysis')
def get(): return weather_analysis()
