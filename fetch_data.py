# deal_finder.py
import json
import time
import statistics
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

import requests
from ebay_auth import get_token_cached  

BROWSE_BASE = "https://api.ebay.com/buy/browse/v1"

def load_config(path: str = "products.json") -> Dict[str, Any]:
    with open(path, "r") as f:
        return json.load(f)

def build_blacklist(cfg: Dict[str, Any], product: Dict[str, Any]) -> List[str]:
    base = [s.lower() for s in cfg.get("default", {}).get("blacklist", [])]
    extra = [s.lower() for s in product.get("blacklist_add", [])]
    remove = set(s.lower() for s in product.get("blacklist_remove", []))

    merged = [s for s in (base + extra) if s not in remove]

    # de-dupe while preserving order
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


# -----------------------------
# eBay Browse API calls
# -----------------------------
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


# -----------------------------
# Deal logic
# -----------------------------
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


def score_deals(
    items: List[Dict[str, Any]],
    discount_threshold: float,
    trim_fraction: float
) -> List[Dict[str, Any]]:
    buckets: Dict[str, List[Dict[str, Any]]] = {}
    for it in items:
        buckets.setdefault(condition_bucket(it), []).append(it)

    deals: List[Dict[str, Any]] = []

    for bucket, bucket_items in buckets.items():
        totals = [total_price(it) for it in bucket_items]
        med = trimmed_median(totals, trim_fraction)
        if med is None or med <= 0:
            continue

        for it in bucket_items:
            t = total_price(it)
            disc = (med - t) / med
            if disc >= discount_threshold:
                deals.append({
                    "bucket": bucket,
                    "bucket_median": med,
                    "discount_pct": disc,
                    "total": t,
                    "title": it.get("title"),
                    "itemId": it.get("itemId"),
                    "url": it.get("itemWebUrl"),
                    "condition": it.get("condition"),
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
    min_price: float = 1.0
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

        cleaned.append(it)

    return cleaned


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
        print(f"[{d['bucket']}] -{pct:.1f}%  total=${d['total']:.2f}  (median=${med:.2f})")
        print(f"  {d['title']}")
        print(f"  {d['url']}\n")


if __name__ == "__main__":
    cfg = load_config("products.json")

    marketplace_id = cfg.get("marketplace_id", "EBAY_US")
    cfg_default = cfg.get("default", {})

    start = time.time()

    for product in cfg.get("products", []):
        name = product.get("name", product.get("query", "Unnamed"))
        query = product["query"]

        limit = int(get_with_default(product, cfg_default, "limit", 100))
        discount_threshold = float(get_with_default(product, cfg_default, "discount_threshold", 0.15))
        trim_fraction = float(get_with_default(product, cfg_default, "trim_fraction", 0.15))
        min_price = float(get_with_default(product, cfg_default, "min_price", 1.0))

        blacklist = build_blacklist(cfg, product)

        items = fetch_keyword_items(
            keyword=query,
            marketplace_id=marketplace_id,
            limit=limit,
            blacklist=blacklist,
            min_price=min_price
        )

        deals = score_deals(items, discount_threshold=discount_threshold, trim_fraction=trim_fraction)
        print_deals(name, query, deals, discount_threshold, top_n=10)

    print(f"Done in {time.time() - start:.2f}s")
