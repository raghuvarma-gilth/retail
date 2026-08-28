from fastapi import APIRouter
from services.anomaly_service import detect_anomalies
router=APIRouter(prefix='/anomaly',tags=['Anomaly'])
@router.get('/')
def get(): return detect_anomalies()
