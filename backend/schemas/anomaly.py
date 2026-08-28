from pydantic import BaseModel
class AnomalyResponse(BaseModel): count:int|None=None
