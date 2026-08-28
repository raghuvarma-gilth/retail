from pydantic import BaseModel
class ForecastInput(BaseModel): features: dict
