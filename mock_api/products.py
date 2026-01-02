from flask import Flask, jsonify, request
import json
import os
import mysql.connector
import hashlib

app = Flask(__name__)

PRODUCTS_JSON_PATH = os.path.join(
    os.path.dirname(__file__), 
    '..', 
    'pricing-engine', 
    'products.json'
)

def connect_to_database(db_config):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        return conn, cursor
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return None, None

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
            "query": product.get("query"),
        })
    
    return jsonify(filtered_products)

@app.route('/deals', methods=['POST'])
def get_deals():
    """
    POST endpoint that returns deals filtered by search term.
    """
    
    db_config = {
        "host": os.environ.get("MYSQL_HOST", "localhost"),
        "port": int(os.environ.get("MYSQL_PORT", 3306)),
        "user": os.environ.get("MYSQL_USER", "root"),
        "password": os.environ.get("MYSQL_PASSWORD", ""),
        "database": os.environ.get("MYSQL_DATABASE", ""),
    }

    conn, cursor = connect_to_database(db_config)
    
    if not conn or not cursor:
        return jsonify({"error": "Failed to connect to database"}), 500
    
    table_name = os.environ.get("MYSQL_TABLE", "")
    
    data = request.get_json()
    api_query_text = data.get('query')
    
    if not api_query_text:
        return jsonify({"error": "API query text is required"}), 400
    
    api_query_id = hashlib.sha256(api_query_text.encode("utf-8")).hexdigest()

    query = f"""
    WITH ranked_prices AS (
      SELECT 
        *,
        PERCENT_RANK() OVER (PARTITION BY api_query_id ORDER BY price) as price_percentile
      FROM {table_name}
      WHERE fetched_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ),
    trimmed_prices AS (
      SELECT *
      FROM ranked_prices
      WHERE price_percentile > 0.15
    ),
    trimmed_medians AS (
      SELECT 
        api_query_id,
        AVG(price) as trimmed_median
      FROM (
        SELECT 
          api_query_id,
          price,
          ROW_NUMBER() OVER (PARTITION BY api_query_id ORDER BY price) as row_num,
          COUNT(*) OVER (PARTITION BY api_query_id) as total_count
        FROM trimmed_prices
      ) ranked
      WHERE row_num IN (FLOOR((total_count + 1) / 2), CEIL((total_count + 1) / 2))
      GROUP BY api_query_id
    )
    SELECT e.*
    FROM {table_name} e
    INNER JOIN trimmed_medians m ON e.api_query_id = m.api_query_id
    WHERE e.price < 0.20 * m.trimmed_median
      AND e.fetched_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND e.api_query_id = '{api_query_id}'
    ORDER BY e.price ASC
    LIMIT 5
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Get column names from cursor description
    columns = [desc[0] for desc in cursor.description]
    
    # Convert results to list of dictionaries with column names
    deals = []
    for row in results:
        deal = dict(zip(columns, row))
        deals.append(deal)
    
    cursor.close()
    conn.close()
    for d in deals:
        d.pop('api_query_id', None) 
        d.pop('ebay_item_id', None)

    return jsonify(deals)
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)