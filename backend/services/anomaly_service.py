import pandas as pd
from services.data_service import get_data, find_column
def detect_anomalies(z=3.0):
    df=get_data().copy()
    sales=find_column(["units_sold","sales","demand","quantity"])
    if not sales: return {"message":"No sales/demand column detected","items":[]}
    s=pd.to_numeric(df[sales],errors="coerce")
    score=(s-s.mean())/(s.std() or 1)
    out=df[score.abs()>z].copy()
    out["z_score"]=score[score.abs()>z]
    return {"count":int(len(out)),"items":out.head(50).to_dict("records"), "anomalies":out.head(50).to_dict("records")}
