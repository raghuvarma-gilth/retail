from services.data_service import get_data, find_column
def promotion_analysis():
    df=get_data(); promo=find_column(["promotion","discount","discount_percent","promotion_type"])
    if not promo: return {"message":"No promotion/discount column detected"}
    return {"column":promo,"top_values":df[promo].value_counts().head(10).to_dict()}
