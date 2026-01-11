// API Base URL - configure this for your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export interface Product {
  name: string;
  category: string;
  query: string;
}

export interface Deal {
  title: string;
  price: number;
  trimmed_median?: number;
  condition?: string;
  listing_url: string;
  fetched_at?: string;
  rn?: number;
  price_percentile?: number;
}

export interface ApiError {
  error: string;
}

/**
 * Fetch all products from the API
 */
export async function fetchProducts(): Promise<Product[]> {
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
export function extractCategories(products: Product[]): string[] {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories).sort();
}

/**
 * Filter products by category
 */
export function filterProductsByCategory(products: Product[], category: string): Product[] {
  return products.filter(p => p.category === category);
}

/**
 * Search for deals using a product query
 */
export async function searchDeals(query: string): Promise<Deal[]> {
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
export function calculateDiscount(price: number | string, median: number | string | undefined | null): number {
  const priceNum = Number(price);
  const medianNum = Number(median);
  if (!medianNum || medianNum === 0) return 0;
  return Math.round(((medianNum - priceNum) / medianNum) * 100);
}
