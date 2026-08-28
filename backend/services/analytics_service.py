from services.data_service import get_data, find_column
def overview():
    df=get_data()
    product=find_column(["product_name","product","sku","product_id"])
    category=find_column(["category","product_category"])
    out={"rows":int(len(df)),"columns":list(df.columns),"unique_products":int(df[product].nunique()) if product else None}
    if category: out["categories"]=int(df[category].nunique())
    return out
