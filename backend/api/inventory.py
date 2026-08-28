from fastapi import APIRouter
from services.inventory_service import restock_summary
router=APIRouter(prefix='/inventory',tags=['Inventory'])
@router.get('/restock')
def restock(): return restock_summary()
