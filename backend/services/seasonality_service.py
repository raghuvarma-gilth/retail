from services.data_service import get_data, find_column
def seasonality_analysis():
    df=get_data(); date=find_column(["date","order_date","sales_date"])
    if not date: return {"message":"No date column detected"}
    s=df.copy(); s[date]=__import__('pandas').to_datetime(s[date], errors='coerce')
    counts=s.dropna(subset=[date]).groupby(s[date].dt.month).size().to_dict()
    return {"monthly_records":{str(k):int(v) for k,v in counts.items()}}
