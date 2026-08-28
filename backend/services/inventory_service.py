from services.data_service import get_data, find_column
def restock_summary():
    df = get_data().copy()
    stock_col = find_column(["inventory_level","stock","stock_level","units_in_stock"])
    product_col = find_column(["product_name","product","sku","product_id"])
    if not stock_col or not product_col:
        return {"message":"No inventory column detected", "items":[]}
    
    # Get latest snapshot per product
    df_latest = df.sort_values(by=stock_col).drop_duplicates(subset=[product_col], keep='first')
    
    low = df_latest[df_latest[stock_col] <= df_latest[stock_col].quantile(.2)]
    items = low[[c for c in [product_col, stock_col] if c]].head(20).to_dict("records")
    return {"low_stock_count":int(len(low)), "items":items}
