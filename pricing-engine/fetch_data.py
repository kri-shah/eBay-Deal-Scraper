import csv
import hashlib
import json
import logging
import os
import time
import statistics
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional, Tuple

import mysql.connector
import requests
from ebay_auth import get_token_cached  

from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env")

# Configure logging
LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_DIR / "fetch_data.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

BROWSE_BASE = "https://api.ebay.com/buy/browse/v1"

def load_config(path: str = "products.json") -> Dict[str, Any]:
    with open(path, "r") as f:
        return json.load(f)

def build_blacklist(cfg: Dict[str, Any], product: Dict[str, Any]) -> List[str]:
    base = [s.lower() for s in cfg.get("default", {}).get("blacklist", [])]
    extra = [s.lower() for s in product.get("blacklist_add", [])]
    remove = set(s.lower() for s in product.get("blacklist_remove", []))

    merged = [s for s in (base + extra) if s not in remove]

    out: List[str] = []
    seen = set()
    for s in merged:
        if s not in seen:
            seen.add(s)
            out.append(s)
    return out

def get_with_default(product: Dict[str, Any], cfg_default: Dict[str, Any], key: str, fallback: Any) -> Any:
    if key in product:
        return product[key]
    if key in cfg_default:
        return cfg_default[key]
    return fallback

def make_headers(marketplace_id: str) -> Dict[str, str]:
    token, _ = get_token_cached()
    return {
        "Authorization": f"Bearer {token}",
        "X-EBAY-C-MARKETPLACE-ID": marketplace_id,
    }

def browse_search(q: str, marketplace_id: str, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
    url = f"{BROWSE_BASE}/item_summary/search"
    params = {"q": q, "limit": limit, "offset": offset}

    r = requests.get(url, headers=make_headers(marketplace_id), params=params, timeout=30)
    if not r.ok:
        raise RuntimeError(f"Browse search failed: {r.status_code} {r.text}")
    return r.json()


def parse_money(m: Optional[Dict[str, Any]]) -> float:
    if not m:
        return 0.0
    try:
        return float(m.get("value", 0.0))
    except Exception:
        return 0.0


def total_price(item: Dict[str, Any]) -> float:
    item_price = parse_money(item.get("price"))
    shipping_cost = 0.0

    shipping_options = item.get("shippingOptions") or []
    if shipping_options:
        shipping_cost = parse_money(shipping_options[0].get("shippingCost"))

    return item_price + shipping_cost

def is_fixed_price(item: Dict[str, Any]) -> bool:
    opts = item.get("buyingOptions") or []
    return "FIXED_PRICE" in opts

def condition_bucket(item: Dict[str, Any]) -> str:
    c = (item.get("condition") or "").lower()
    if "new" in c:
        return "NEW"
    if "used" in c:
        return "USED"
    return "OTHER"

def looks_junk(title: str, blacklist: List[str]) -> bool:
    t = (title or "").lower()
    return any(bad in t for bad in blacklist)


def trimmed_median(values: List[float], trim_fraction: float) -> Optional[float]:
    vals = sorted(v for v in values if v is not None)
    n = len(vals)
    if n == 0:
        return None
    if n < 5:
        return statistics.median(vals)

    k = int(n * trim_fraction)
    trimmed = vals[k: max(n - k, k + 1)]
    if not trimmed:
        return statistics.median(vals)
    return statistics.median(trimmed)

def round2(val: float) -> float:
    return float(Decimal(str(val)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))

def score_deals(
    items: List[Dict[str, Any]],
    discount_threshold: float,
    trim_fraction: float
) -> List[Dict[str, Any]]:
    condition_groups: Dict[str, List[Dict[str, Any]]] = {}
    for it in items:
        condition_groups.setdefault(condition_bucket(it), []).append(it)

    deals: List[Dict[str, Any]] = []

    for cond, cond_items in condition_groups.items():
        totals = [total_price(it) for it in cond_items]
        med = trimmed_median(totals, trim_fraction)
        if med is None or med <= 0:
            continue

        for it in cond_items:
            t = total_price(it)
            disc = (med - t) / med
            if disc >= discount_threshold:
                deals.append({
                    "condition": cond,
                    "bucket_median": round2(med),
                    "discount_pct": round2(disc),
                    "total": t,
                    "title": it.get("title"),
                    "itemId": it.get("itemId"),
                    "url": it.get("itemWebUrl"),
                    "item_condition": it.get("condition"),
                    "buyingOptions": it.get("buyingOptions"),
                    "price": it.get("price"),
                })

    deals.sort(key=lambda d: d["discount_pct"], reverse=True)
    return deals

def fetch_keyword_items(
    keyword: str,
    marketplace_id: str,
    limit: int,
    blacklist: List[str],
    min_price: float = 1.0,
    conditions: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    data = browse_search(keyword, marketplace_id=marketplace_id, limit=limit)
    raw = data.get("itemSummaries", []) or []

    cleaned: List[Dict[str, Any]] = []
    for it in raw:
        title = it.get("title") or ""
        if not title:
            continue
        if not is_fixed_price(it):
            continue
        if looks_junk(title, blacklist):
            continue
        if parse_money(it.get("price")) < min_price:
            continue
        
        if conditions:
            item_condition = condition_bucket(it)
            if item_condition not in conditions:
                continue

        cleaned.append(it)

    return cleaned

def insert_listings_to_db(
    items: List[Dict[str, Any]],
    marketplace_id: str,
    query_name: str,
    api_query_text: str,
    db_config: Dict[str, Any]
) -> int:
    operation_start = time.perf_counter()
    records_attempted = len(items)
    records_failed = 0
    
    if not items:
        logger.info(
            "DB_WRITE | query=%s | records_attempted=0 | records_written=0 | "
            "records_failed=0 | duration_ms=0 | status=SKIPPED",
            query_name
        )
        return 0
    
    api_query_id = hashlib.sha256(api_query_text.encode("utf-8")).hexdigest()
    
    fetched_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    table_name = os.environ.get("MYSQL_TABLE", "")
    
    if not table_name or not table_name.replace('_', '').isalnum():
        logger.error(
            "DB_WRITE | query=%s | status=FAILED | error=Invalid table name configuration",
            query_name
        )
        raise ValueError("Invalid table name configuration")
    
    insert_sql = f"""
        INSERT INTO  {table_name} (
            marketplace_id,
            query_name,
            api_query_text,
            api_query_id,
            fetched_at,
            ebay_item_id,
            title,
            condition_category,
            condition_description,
            listing_url,
            price,
            currency
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        ON DUPLICATE KEY UPDATE id=id
    """
    
    rows_inserted = 0
    conn = None
    cursor = None
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        for item in items:
            ebay_item_id = item.get("itemId", "")
            title = (item.get("title") or "")[:512]
            
            cond_category = condition_bucket(item)
            cond_description = item.get("condition")
            if cond_description:
                cond_description = cond_description[:255]  
            
            listing_url = (item.get("itemWebUrl") or "")[:2048]  
            
            price_data = item.get("price") or {}
            price = parse_money(price_data)
            currency = price_data.get("currency", "USD")[:3]
            
            row_data = (
                marketplace_id,
                query_name[:64], 
                api_query_text[:255],
                api_query_id,
                fetched_at,
                ebay_item_id[:64],  
                title,
                cond_category[:64],
                cond_description,
                listing_url,
                price,
                currency,
            )
            
            try:
                cursor.execute(insert_sql, row_data)
                if cursor.rowcount > 0:
                    rows_inserted += 1
            except mysql.connector.Error as e:
                records_failed += 1
                logger.warning(
                    "DB_WRITE_ITEM | query=%s | ebay_item_id=%s | status=FAILED | error=%s",
                    query_name, ebay_item_id, str(e)
                )
        
        conn.commit()
        
        duration_ms = (time.perf_counter() - operation_start) * 1000
        logger.info(
            "DB_WRITE | query=%s | table=%s | marketplace=%s | "
            "records_attempted=%d | records_written=%d | records_failed=%d | "
            "records_skipped=%d | duration_ms=%.2f | status=SUCCESS",
            query_name, table_name, marketplace_id,
            records_attempted, rows_inserted, records_failed,
            records_attempted - rows_inserted - records_failed, duration_ms
        )
        
    except mysql.connector.Error as e:
        duration_ms = (time.perf_counter() - operation_start) * 1000
        logger.error(
            "DB_WRITE | query=%s | table=%s | records_attempted=%d | "
            "duration_ms=%.2f | status=FAILED | error=%s",
            query_name, table_name, records_attempted, duration_ms, str(e)
        )
        if conn:
            conn.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    
    return rows_inserted


def print_deals(name: str, keyword: str, deals: List[Dict[str, Any]], discount_threshold: float, top_n: int = 10):
    print("\n" + "=" * 90)
    print(f"{name} (query: '{keyword}') — deals (≥ {int(discount_threshold * 100)}% below trimmed median)")
    print("=" * 90)

    if not deals:
        print("No deals found with current filters. Try lowering threshold or increasing limit.")
        return

    for d in deals[:top_n]:
        pct = d["discount_pct"] * 100
        med = d["bucket_median"]
        print(f"[{d['condition']}] -{pct:.1f}%  total=${d['total']:.2f}  (median=${med:.2f})")
        print(f"  {d['title']}")
        print(f"  {d['url']}\n")


def save_deals_csv(deals: List[Dict[str, Any]], path: str) -> None:
    """Save scored deals to a CSV file in a consistent column order."""
    fieldnames = [
        "condition",
        "bucket_median",
        "discount_pct",
        "total",
        "title",
        "itemId",
        "url",
        "item_condition",
        "buyingOptions",
        "price",
    ]

    write_header = not os.path.exists(path) or os.path.getsize(path) == 0

    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if write_header:
            writer.writeheader()

        for deal in deals:
            row = {}
            for key in fieldnames:
                val = deal.get(key)
                if isinstance(val, (dict, list)):
                    row[key] = json.dumps(val)
                else:
                    row[key] = val
            writer.writerow(row)

if __name__ == "__main__":    
    BASE_DIR = Path(__file__).resolve().parent
    cfg = load_config(str(BASE_DIR / "products.json"))

    marketplace_id = cfg.get("marketplace_id", "EBAY_US")
    cfg_default = cfg.get("default", {})

    run_start = time.time()
    total_products = len(cfg.get("products", []))
    total_items_fetched = 0
    total_records_written = 0
    total_deals_found = 0
    
    logger.info(
        "RUN_START | products_count=%d | marketplace=%s",
        total_products, marketplace_id
    )

    for product in cfg.get("products", []):
        name = product.get("name", product.get("query", "Unnamed"))
        query = product["query"]

        limit = int(get_with_default(product, cfg_default, "limit", 100))
        discount_threshold = float(get_with_default(product, cfg_default, "discount_threshold", 0.15))
        trim_fraction = float(get_with_default(product, cfg_default, "trim_fraction", 0.15))
        min_price = float(get_with_default(product, cfg_default, "min_price", 1.0))
        conditions = get_with_default(product, cfg_default, "conditions", None)

        blacklist = build_blacklist(cfg, product)
        
        logger.info("FETCH_START | query=%s | limit=%d", name, limit)
        
        items = fetch_keyword_items(
            keyword=query,
            marketplace_id=marketplace_id,
            limit=limit,
            blacklist=blacklist,
            min_price=min_price,
            conditions=conditions
        )
        
        total_items_fetched += len(items)
        logger.info("FETCH_COMPLETE | query=%s | items_fetched=%d", name, len(items))
        
        db_config = {
            "host": os.environ.get("MYSQL_HOST", "localhost"),
            "port": int(os.environ.get("MYSQL_PORT", 3306)),
            "user": os.environ.get("MYSQL_USER", "root"),
            "password": os.environ.get("MYSQL_PASSWORD", ""),
            "database": os.environ.get("MYSQL_DATABASE", ""),
        }

        records_written = insert_listings_to_db(
            items, 
            marketplace_id=marketplace_id, 
            query_name=name, 
            api_query_text=query, 
            db_config=db_config
        )
        total_records_written += records_written
        
        deals = score_deals(items, discount_threshold=discount_threshold, trim_fraction=trim_fraction)
        total_deals_found += len(deals)
        save_deals_csv(deals, f"logs/deals.csv") # add _{name} to csv to have separate files for each product - keeping one massive file for now
        # print_deals(name, query, deals, discount_threshold, top_n=10)

    run_duration = time.time() - run_start
    logger.info(
        "RUN_COMPLETE | products_processed=%d | total_items_fetched=%d | "
        "total_records_written=%d | total_deals_found=%d | duration_sec=%.2f",
        total_products, total_items_fetched, total_records_written, 
        total_deals_found, run_duration
    )
