import pandas as pd
def clean(df: pd.DataFrame): return df.drop_duplicates().copy()
