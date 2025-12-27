# eBay Deal Scraper

A Python-based tool to find deals on eBay by fetching listings and analyzing prices against median values.

## Progress

### 1. eBay Authentication ✓
- Implemented OAuth 2.0 client credentials flow (`ebay_auth.py`)
- Token caching with automatic refresh before expiration
- Support for sandbox and production environments
- Configurable via `.env` file

### 2. API Fetching & CSV Storage ✓
- Fetch listings from eBay Browse API (`fetch_data.py`)
- Filter by condition, price, blacklisted keywords
- Score deals using trimmed median pricing within condition buckets
- Export results to `deals.csv` for analysis

**Key Features:**
- Configurable product queries via `products.json`
- Discount threshold and trim fraction settings
- Condition-based price comparisons (NEW/USED/OTHER)

### 3. Database Design (In Progress)
- Designing denormalized MySQL schema for testing (`denormalized_erd.txt`)
- Single `ebay_listings` table with time-series data
- Will migrate to DynamoDB for production

**Schema highlights:**
- Unique constraint on `(api_query_id, fetched_at, ebay_item_id)`
- Indexes for time-based queries
- Tracks marketplace, query, price, condition per listing

## Next Steps
- [ ] Implement MySQL insert logic
- [ ] Test time-series queries
- [ ] Plan DynamoDB migration strategy

