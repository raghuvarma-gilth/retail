from services.data_service import get_data, find_column
def weather_analysis():
    df=get_data(); weather=find_column(["weather","weather_condition","temperature"])
    if not weather: return {"message":"Dataset has no weather column; connect Weather API for live weather."}
    return {"column":weather,"distribution":df[weather].value_counts().head(10).to_dict()}
