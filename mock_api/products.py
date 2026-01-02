from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

PRODUCTS_JSON_PATH = os.path.join(
    os.path.dirname(__file__), 
    '..', 
    'pricing-engine', 
    'products.json'
)

@app.route('/products', methods=['GET'])
def get_products():
    """
    GET endpoint that returns products with only name and category fields.
    """
    with open(PRODUCTS_JSON_PATH, 'r') as f:
        data = json.load(f)
    
    products = data.get('products', [])
    
    filtered_products = []
    for product in products:
        filtered_products.append({
            "name": product.get("name"),
            "category": product.get("category"),
        })
    
    return jsonify(filtered_products)

if __name__ == '__main__':
    app.run(debug=True, port=5000)