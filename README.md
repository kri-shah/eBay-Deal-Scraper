# eBay Deal Scraper

A pricing engine that identifies undervalued eBay listings by comparing live prices against historical trimmed medians.

---

## What’s Built So Far

### Core Pricing Engine
- eBay Browse API integration with OAuth2
- Deal scoring using condition-based, trimmed median pricing
- Configurable product queries and discount thresholds
- Automated data collection via cron
- CSV outputs for validation and analysis

### Temporary MySQL Database
- Denormalized schema for rapid iteration
- Time-series storage for listings
- Composite uniqueness to prevent duplicate inserts
- Used to validate data model and pricing logic

### Temporary API (Mock Backend)
- Flask REST API serving deals and product statistics
- Backed by CSV / MySQL for local testing
- Designed to mirror future AWS API Gateway behavior

### System Design
- Serverless AWS architecture designed
- Lambda, DynamoDB, and API Gateway
- Architecture diagram included in `/design`

### Rough Frontend 
- React-based UI for browsing and visualizing deals
- Integration with existing mock API

---

## What’s Next

### AWS Migration
- Replace cron + MySQL with EventBridge + DynamoDB
- Deploy pricing engine as Lambda functions
- Migrate mock API to API Gateway
- Add CloudWatch logging and monitoring