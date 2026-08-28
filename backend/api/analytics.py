from fastapi import APIRouter
from services.analytics_service import overview
router=APIRouter(prefix='/analytics',tags=['Analytics'])
@router.get('/overview')
def get(): return overview()
