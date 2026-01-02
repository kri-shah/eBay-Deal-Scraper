# eBay Deal Scraper

A Python-based tool to find deals on eBay by fetching listings and analyzing prices against median values.

## Progress

### 1. eBay Authentication ✓
- Implemented OAuth 2.0 client credentials flow (`pricing-engine/ebay_auth.py`)
- Token caching with automatic refresh before expiration

### 2. API Fetching & CSV Storage ✓
- Fetch listings from eBay Browse API (`pricing-engine/fetch_data.py`)
- Filter by condition, price, blacklisted keywords
- Score deals using trimmed median pricing within condition buckets
- Export results to `logs/deals.csv` for analysis

**Key Features:**
- Configurable product queries via `pricing-engine/products.json`
- Discount threshold and trim fraction settings
- Condition-based price comparisons (NEW/USED/OTHER)

### 3. Temporary MySQL Database ✓
- Designed denormalized MySQL schema for testing (`design/denormalized_erd.txt`)
- Single `ebay_listings` table with time-series data
- Implemented insert logic in `pricing-engine/fetch_data.py`
- To test the database, automated data collection via cron

**Schema highlights:**
- Unique constraint on `(api_query_id, fetched_at, ebay_item_id)`
- Automatic duplicate prevention on insert

### 4. AWS Production Architecture ✓
- Designed serverless architecture diagram (`design/AWS_design_diagram.png`)
- Lambda functions for data collection
- DynamoDB for historical pricing data
- API Gateway for frontend integration

### 5. Pricing Engine ✓
- Completed data fetching and deal scoring logic
- Condition-based median price calculations with trimming
- Automatic data collection via cron job (`logs/cron.log`)
- CSV export for historical analysis (`logs/deals.csv`, `logs/db.csv`)

## Current Status

**In Progress:**
- SQL queries for averaging prices based on listing history
- Mock Flask API (`mock_api/products.py`) - will simulate API Gateway on AWS

## Next Steps

1. **Mock API Development**
   - Create Flask API in `mock_api/products.py`
   - Endpoints for fetching deals and product statistics
   - Will serve as prototype for AWS API Gateway integration

2. **Frontend Development**
   - Build web interface to display deals
   - Connect to mock API endpoints
