from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.forecast_service import predict
router=APIRouter(prefix="/forecast",tags=["Forecast"])
class ForecastRequest(BaseModel): features: dict
@router.post("/predict")
def forecast(req: ForecastRequest):
    try: 
        result = predict(req.features)
        return result
    except Exception as e: raise HTTPException(500,str(e))
