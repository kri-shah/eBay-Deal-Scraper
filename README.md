# eBay Deal Scraper

A Python-based tool to find deals on eBay by fetching listings and analyzing prices against historical median values.

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

### 6. Mock API ✓
- Flask API implementation complete (`mock-api/products.py`)
- RESTful endpoints for fetching deals and product statistics
- Serves as prototype for AWS API Gateway integration
- CSV-based data storage for local testing

**Key Endpoints:**
- `GET /api/products` - Fetch all product categories and names
- `GET /api/deals` - Retrieve current deals with filtering options

## Current Status

**Completed:**
- ✓ eBay API integration and authentication
- ✓ Pricing engine with deal scoring algorithm
- ✓ Mock API with RESTful endpoints
- ✓ AWS architecture design

**Next Up:**
- Frontend development for deal visualization
- AWS migration of entire stack

## Next Steps

1. **Frontend Development**
   - Build web interface to display deals
   - Connect to mock API endpoints
   - Implement filtering and sorting functionality
   - Add product details and deal highlights

2. **AWS Migration**
   - Deploy Lambda functions for data collection
   - Set up DynamoDB for historical pricing data
   - Configure API Gateway to replace mock API
   - Implement CloudWatch for monitoring and logging
   - Set up EventBridge for scheduled scraping
