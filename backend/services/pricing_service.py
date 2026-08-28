from services.data_service import get_data, find_column
def price_analysis():
    df=get_data(); price=find_column(["price","unit_price","selling_price"])
    if not price: return {"message":"No price column detected"}
    return {"min_price":float(df[price].min()),"max_price":float(df[price].max()),"avg_price":float(df[price].mean())}
