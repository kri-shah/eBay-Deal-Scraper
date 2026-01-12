# eBay Deal Finder Frontend

A React + Tailwind CSS frontend for the eBay pricing engine that helps find deals below market price.

## Features

- 🔍 **Search deals** by category and item
- 📊 **Sort results** by price or discount percentage
- 📱 **Responsive design** - works on desktop and mobile
- ⏳ **Loading states** for all API calls
- ❌ **Error handling** with visible error banners
- 🎨 **Modern UI** with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see mock-api/)

### Installation

```bash
cd frontend
npm install
```

### Configuration

Configure the API base URL by setting the `VITE_API_BASE_URL` environment variable:

```bash
# Option 1: Create a .env file
echo "VITE_API_BASE_URL=http://localhost:5000" > .env

# Option 2: Set inline when running
VITE_API_BASE_URL=http://localhost:5000 npm run dev
```

**Default:** If not set, the app uses `http://localhost:5000`

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── client.ts        # API client with fetch calls
├── components/
│   ├── DealCard.jsx     # Individual deal card component
│   ├── DealsList.jsx    # List/grid of deals with sorting
│   └── FiltersBar.jsx   # Category, item, and search filters
├── hooks/
│   └── useDealsSearch.js # Main state management hook
├── App.jsx              # Root application component
├── main.jsx             # React entry point
└── index.css            # Tailwind imports
```

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | Fetches all products with categories |
| `/deals` | POST | Searches for deals (body: `{ query: string }`) |

## Usage

1. **Select a Category** from the dropdown
2. **Select an Item** from the category
3. **Optionally** enter a custom search query
4. Click **Search Deals** to find deals

Results can be sorted by:
- **Price** (ascending/descending)
- **Discount %** (ascending/descending)

Each deal card shows:
- Title
- Current price & historical median
- Discount percentage
- Item condition
- Link to eBay listing
