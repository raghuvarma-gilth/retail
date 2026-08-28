import os
import json
import pickle
from sentence_transformers import SentenceTransformer, util
from services.data_service import get_data, find_column

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "ml", "product_embeddings.pkl")
NAMES_PATH = os.path.join(BASE_DIR, "ml", "product_names.json")

_model = None
_embeddings = None
_product_names = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def generate_and_save_embeddings():
    global _embeddings, _product_names
    
    df = get_data()
    if df is None or df.empty:
        raise ValueError("Dataset is empty")
        
    col = find_column(["product_name", "product", "sku", "product_id"])
    if not col:
        raise ValueError("Could not find product column in dataset")
        
    product_names = df[col].dropna().astype(str).unique().tolist()
    
    model = get_model()
    # Generate embeddings as tensors
    embeddings = model.encode(product_names, convert_to_tensor=True)
    
    os.makedirs(os.path.join(BASE_DIR, "ml"), exist_ok=True)
    
    with open(EMBEDDINGS_PATH, "wb") as f:
        pickle.dump(embeddings, f)
        
    with open(NAMES_PATH, "w") as f:
        json.dump(product_names, f)
        
    _embeddings = embeddings
    _product_names = product_names
    return True

def load_embeddings():
    global _embeddings, _product_names
    if _embeddings is not None and _product_names is not None:
        return
        
    if not os.path.exists(EMBEDDINGS_PATH) or not os.path.exists(NAMES_PATH):
        generate_and_save_embeddings()
    else:
        with open(EMBEDDINGS_PATH, "rb") as f:
            _embeddings = pickle.load(f)
        with open(NAMES_PATH, "r") as f:
            _product_names = json.load(f)

def semantic_search(query: str, top_n: int = 5):
    load_embeddings()
    model = get_model()
    
    q_emb = model.encode(query, convert_to_tensor=True)
    scores = util.cos_sim(q_emb, _embeddings)[0].cpu().tolist()
    
    results = []
    for score, name in sorted(zip(scores, _product_names), reverse=True)[:top_n]:
        results.append({"product": name, "similarity": round(score, 4)})
    return results

def similar_product_search(product_name: str, top_n: int = 5):
    load_embeddings()
    
    if product_name not in _product_names:
        return {"error": "Product not found", "similar_products": []}
        
    idx = _product_names.index(product_name)
    target_emb = _embeddings[idx]
    
    scores = util.cos_sim(target_emb, _embeddings)[0].cpu().tolist()
    
    results = []
    for score, name in sorted(zip(scores, _product_names), reverse=True):
        if name != product_name:
            results.append({"product": name, "similarity": round(score, 4)})
        if len(results) >= top_n:
            break
            
    return {"product": product_name, "similar_products": results}
