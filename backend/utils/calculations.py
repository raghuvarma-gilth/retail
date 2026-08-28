def restock_quantity(predicted_demand,current_stock,safety_stock=0): return max(0,float(predicted_demand)+float(safety_stock)-float(current_stock))
