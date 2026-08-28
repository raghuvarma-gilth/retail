from pydantic import BaseModel
class InventoryResponse(BaseModel): low_stock_count:int|None=None
