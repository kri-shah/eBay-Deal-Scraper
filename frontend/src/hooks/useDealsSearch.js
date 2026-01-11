import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchProducts,
  extractCategories,
  filterProductsByCategory,
  searchDeals,
  calculateDiscount,
} from '../api/client';

export function useDealsSearch() {
  // Products data
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Selection state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  // Deals data
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [dealsError, setDealsError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState('price'); // 'price' | 'discount'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Derived state
  const categories = useMemo(() => extractCategories(products), [products]);
  
  const items = useMemo(
    () => (selectedCategory ? filterProductsByCategory(products, selectedCategory) : []),
    [products, selectedCategory]
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.name === selectedItem),
    [products, selectedItem]
  );

  const canSearch = Boolean(selectedCategory && selectedItem);

  // Sorted deals
  const sortedDeals = useMemo(() => {
    const dealsWithDiscount = deals.map((deal) => ({
      ...deal,
      priceNum: Number(deal.price) || 0,
      discount: calculateDiscount(deal.price, deal.trimmed_median),
    }));

    return [...dealsWithDiscount].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'price') {
        comparison = a.priceNum - b.priceNum;
      } else if (sortBy === 'discount') {
        comparison = a.discount - b.discount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [deals, sortBy, sortOrder]);

  // Fetch products on mount
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError(null);

      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setProductsError(err.message || 'Failed to load products');
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Reset item selection when category changes
  useEffect(() => {
    setSelectedItem('');
  }, [selectedCategory]);

  // Search function
  const search = useCallback(async () => {
    if (!selectedProduct) return;

    setDealsLoading(true);
    setDealsError(null);
    setHasSearched(true);

    try {
      const query = selectedProduct.query;
      const data = await searchDeals(query);
      setDeals(data);
    } catch (err) {
      setDealsError(err.message || 'Failed to search deals');
      setDeals([]);
    } finally {
      setDealsLoading(false);
    }
  }, [selectedProduct]);

  // Clear error
  const clearError = useCallback(() => {
    setProductsError(null);
    setDealsError(null);
  }, []);

  // Toggle sort
  const toggleSort = useCallback((field) => {
    setSortBy((current) => {
      if (current === field) {
        // Toggle order if same field
        setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
        return current;
      }
      // New field: price starts ascending (low to high), discount starts descending (high to low)
      setSortOrder(field === 'discount' ? 'desc' : 'asc');
      return field;
    });
  }, []);

  return {
    // Products
    products,
    categories,
    items,
    productsLoading,
    productsError,

    // Selection
    selectedCategory,
    setSelectedCategory,
    selectedItem,
    setSelectedItem,
    canSearch,

    // Deals
    deals: sortedDeals,
    dealsLoading,
    dealsError,
    hasSearched,

    // Sort
    sortBy,
    sortOrder,
    toggleSort,

    // Actions
    search,
    clearError,
  };
}
