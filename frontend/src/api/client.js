// API Base URL - configure this for your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

/**
 * Fetch all products from the API
 */
export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch products' }));
    throw new Error(error.error || 'Failed to fetch products');
  }
  
  return response.json();
}

/**
 * Extract unique categories from products
 */
export function extractCategories(products) {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories).sort();
}

/**
 * Filter products by category
 */
export function filterProductsByCategory(products, category) {
  return products.filter(p => p.category === category);
}

/**
 * Search for deals using a product query
 */
export async function searchDeals(query) {
  const response = await fetch(`${API_BASE_URL}/deals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to search deals' }));
    throw new Error(error.error || 'Failed to search deals');
  }
  
  return response.json();
}

/**
 * Calculate discount percentage from price and median
 */
export function calculateDiscount(price, median) {
  const priceNum = Number(price);
  const medianNum = Number(median);
  if (!medianNum || medianNum === 0) return 0;
  return Math.round(((medianNum - priceNum) / medianNum) * 100);
}

/**
 * Fan-out /deals across every product and return a flat result set.
 * Each returned entry keeps a reference to its source product + benchmark so
 * downstream code can derive category, fair value, trim window, etc.
 *
 * Returns { results: [{ product, benchmark, listings, error? }], errors: string[] }.
 */
export async function fetchDealsForProducts(products, { concurrency = 6 } = {}) {
  const results = new Array(products.length);
  const errors = [];
  let cursor = 0;

  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= products.length) return;
      const product = products[i];
      try {
        const data = await searchDeals(product.query);
        results[i] = {
          product,
          benchmark: data?.benchmark ?? null,
          listings: Array.isArray(data?.listings) ? data.listings : [],
        };
      } catch (err) {
        const message = err?.message || 'Failed to fetch deals';
        errors.push(`${product.name || product.query}: ${message}`);
        results[i] = { product, benchmark: null, listings: [], error: message };
      }
    }
  }

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, products.length || 1)) },
    () => worker()
  );
  await Promise.all(workers);

  return { results, errors };
}
