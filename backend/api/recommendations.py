from fastapi import APIRouter
from services.recommendation_service import business_recommendations
router=APIRouter(prefix='/recommendations',tags=['Recommendations'])
@router.get('/')
def get(): return business_recommendations()
