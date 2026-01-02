from flask import Flask, jsonify, request
import json
import os
import mysql.connector
from mysql.connector import pooling
import hashlib

app = Flask(__name__)

PRODUCTS_JSON_PATH = os.path.join(
    os.path.dirname(__file__), 
    '..', 
    'pricing-engine', 
    'products.json'
)

db_config = {
    "host": os.environ.get("MYSQL_HOST", "localhost"),
    "port": int(os.environ.get("MYSQL_PORT", 3306)),
    "user": os.environ.get("MYSQL_USER", "root"),
    "password": os.environ.get("MYSQL_PASSWORD", ""),
    "database": os.environ.get("MYSQL_DATABASE", ""),
}

try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5,
        pool_reset_session=True,
        **db_config
    )
    print("Connection pool created successfully")

except mysql.connector.Error as e:
    print(f"Error creating connection pool: {e}")
    connection_pool = None

def get_db_connection():
    """Get a connection from the pool"""
    if connection_pool:
        try:
            return connection_pool.get_connection()
        except mysql.connector.Error as e:
            print(f"Error getting connection from pool: {e}")
            return None
    return None

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
    
    # Get connection from pool
    conn = get_db_connection()
    
    if not conn:
        return jsonify({"error": "Failed to connect to database"}), 500
    
    cursor = conn.cursor()
    
    table_name = os.environ.get("MYSQL_TABLE", "")
    
    # Validate table name (whitelist approach - table names can't be parameterized)
    # Only allow alphanumeric characters and underscores
    if not table_name or not table_name.replace('_', '').isalnum():
        return jsonify({"error": "Invalid table name"}), 500
    
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
    WHERE e.price < 0.80 * m.trimmed_median
      AND e.price > 0.35 * m.trimmed_median
      AND e.fetched_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND e.api_query_id = %s
    ORDER BY e.price ASC
    LIMIT 5
    """
    
    try:
        cursor.execute(query, (api_query_id,))
        results = cursor.fetchall()
        
        columns = [desc[0] for desc in cursor.description]
        
        deals = []
        for row in results:
            deal = dict(zip(columns, row))
            deals.append(deal)
        
        for d in deals:
            d.pop('api_query_id', None) 
            d.pop('ebay_item_id', None)
        
        return jsonify(deals)
    
    except mysql.connector.Error as e:
        return jsonify({"error": f"Database query failed: {str(e)}"}), 500
    
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)