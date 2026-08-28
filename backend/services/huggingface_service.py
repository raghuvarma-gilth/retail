import os
import json
import pickle
import numpy as np
from services.data_service import get_data, find_column

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "ml", "product_embeddings.pkl")
NAMES_PATH = os.path.join(BASE_DIR, "ml", "product_names.json")

# In-memory caches (loaded lazily on demand, not on startup)
_model = None
_embeddings = None
_product_names = None

def get_model():
    """Lazy load SentenceTransformer in CPU mode only when needed."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer(MODEL_NAME, device="cpu")
        except Exception as e:
            print(f"Warning: Could not load SentenceTransformer ({e}). Using fallback search.")
            _model = None
    return _model

def _to_numpy(tensor_or_array):
    """Safely convert PyTorch Tensor, list, or NumPy array to a float32 NumPy array."""
    if tensor_or_array is None:
        return None
    if isinstance(tensor_or_array, np.ndarray):
        return tensor_or_array.astype(np.float32)
    if hasattr(tensor_or_array, "cpu"):
        return tensor_or_array.cpu().detach().numpy().astype(np.float32)
    return np.array(tensor_or_array, dtype=np.float32)

def _cosine_similarity(vec, matrix):
    """Compute cosine similarity using pure NumPy for minimal memory consumption."""
    vec = _to_numpy(vec)
    matrix = _to_numpy(matrix)
    
    if vec.ndim == 1:
        vec = vec.reshape(1, -1)
    
    vec_norm = np.linalg.norm(vec, axis=1, keepdims=True)
    matrix_norm = np.linalg.norm(matrix, axis=1, keepdims=True)
    
    vec_norm[vec_norm == 0] = 1e-10
    matrix_norm[matrix_norm == 0] = 1e-10
    
    vec_normalized = vec / vec_norm
    matrix_normalized = matrix / matrix_norm
    
    scores = np.dot(vec_normalized, matrix_normalized.T)[0]
    return scores.tolist()

def generate_and_save_embeddings():
    """Generate embeddings if missing (called lazily, not at import time)."""
    global _embeddings, _product_names
    
    df = get_data()
    if df is None or df.empty:
        raise ValueError("Dataset is empty")
        
    col = find_column(["product_name", "product", "sku", "product_id"])
    if not col:
        raise ValueError("Could not find product column in dataset")
        
    product_names = df[col].dropna().astype(str).unique().tolist()
    
    model = get_model()
    if model is not None:
        embeddings = model.encode(product_names, convert_to_numpy=True)
    else:
        embeddings = np.zeros((len(product_names), 384), dtype=np.float32)
    
    os.makedirs(os.path.join(BASE_DIR, "ml"), exist_ok=True)
    
    with open(EMBEDDINGS_PATH, "wb") as f:
        pickle.dump(embeddings, f)
        
    with open(NAMES_PATH, "w") as f:
        json.dump(product_names, f)
        
    _embeddings = _to_numpy(embeddings)
    _product_names = product_names
    return True

def load_embeddings():
    """Lazy load precomputed product embeddings and names into memory only when queried."""
    global _embeddings, _product_names
    if _embeddings is not None and _product_names is not None:
        return
        
    if not os.path.exists(EMBEDDINGS_PATH) or not os.path.exists(NAMES_PATH):
        generate_and_save_embeddings()
    else:
        with open(EMBEDDINGS_PATH, "rb") as f:
            raw_emb = pickle.load(f)
            _embeddings = _to_numpy(raw_emb)
        with open(NAMES_PATH, "r") as f:
            _product_names = json.load(f)

def semantic_search(query: str, top_n: int = 5):
    """Semantic search using SentenceTransformers when available, with fast fallback."""
    load_embeddings()
    
    if not _product_names:
        return []
    
    model = get_model()
    if model is not None and _embeddings is not None:
        try:
            q_emb = model.encode(query, convert_to_numpy=True)
            scores = _cosine_similarity(q_emb, _embeddings)
            results = []
            for score, name in sorted(zip(scores, _product_names), reverse=True)[:top_n]:
                results.append({"product": name, "similarity": round(float(score), 4)})
            return results
        except Exception as e:
            print(f"Model encoding error ({e}). Falling back to text search.")
    
    # Lightweight text-matching fallback (0 MB RAM overhead)
    q_lower = query.lower()
    matches = []
    for name in _product_names:
        score = 0.95 if q_lower in name.lower() else (0.6 if any(w in name.lower() for w in q_lower.split()) else 0.1)
        matches.append({"product": name, "similarity": score})
    return sorted(matches, key=lambda x: x["similarity"], reverse=True)[:top_n]

def similar_product_search(product_name: str, top_n: int = 5):
    """Find similar products using precomputed embeddings with zero model load overhead."""
    load_embeddings()
    
    if not _product_names or product_name not in _product_names:
        return {"error": "Product not found", "similar_products": []}
        
    idx = _product_names.index(product_name)
    target_emb = _embeddings[idx]
    
    scores = _cosine_similarity(target_emb, _embeddings)
    
    results = []
    for score, name in sorted(zip(scores, _product_names), reverse=True):
        if name != product_name:
            results.append({"product": name, "similarity": round(float(score), 4)})
        if len(results) >= top_n:
            break
            
    return {"product": product_name, "similar_products": results}
