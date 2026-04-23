import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProducts, fetchDealsForProducts } from '../api/client';

const CATEGORY_IMAGE_MAP = {
  Laptop: 'laptop',
  Audio: 'headphones',
  Tablet: 'tablet',
  GPU: 'gpu',
  CPU: 'gpu',
  Camera: 'camera',
  Storage: 'ssd',
  Wearable: 'watch',
  Watches: 'watch',
  Drone: 'drone',
  Console: 'steamdeck',
  Handheld: 'steamdeck',
  TV: 'tv',
  Phone: 'tablet',
  Networking: 'ssd',
  VR: 'camera',
  Sneakers: 'steamdeck',
  Collectibles: 'kindle',
  Tools: 'drone',
};

function stableId(url, fallback) {
  if (!url) return fallback || 'L-000000';
  let hash = 0;
  for (let i = 0; i < url.length; i += 1) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
  }
  const absHash = Math.abs(hash) % 900000 + 100000;
  return `L-${absHash}`;
}

function normalizeCondition(raw) {
  if (!raw) return 'other';
  const c = String(raw).toLowerCase();
  if (c.includes('new')) return 'new';
  if (c.includes('used') || c.includes('pre-owned') || c.includes('refurbish')) return 'used';
  return 'other';
}

function savingsFromListing(listing) {
  const price = Number(listing.price) || 0;
  const fair = Number(listing.fairValue) || 0;
  const dollars = fair > 0 ? fair - price : 0;
  const pct = fair > 0 ? (dollars / fair) * 100 : Number(listing.discount_pct) || 0;
  return { dollars, pct };
}

export function useDealFeed() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [dealsLoading, setDealsLoading] = useState(false);
  const [dealsError, setDealsError] = useState(null);
  const [productResults, setProductResults] = useState([]);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategoryState] = useState('all');
  const [productName, setProductName] = useState(null);
  const [minSavings, setMinSavings] = useState(0);
  const [condition, setCondition] = useState('any');
  const [sortKey, setSortKey] = useState('pct');
  const [sortDir, setSortDir] = useState('desc');

  const setCategory = useCallback((next) => {
    setCategoryState((prev) => {
      if (prev !== next) setProductName(null);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setProductsLoading(true);
      setProductsError(null);
      setDealsError(null);

      try {
        const data = await fetchProducts();
        if (cancelled) return;
        setProducts(data);
        setProductsLoading(false);

        setDealsLoading(true);
        const { results, errors } = await fetchDealsForProducts(data);
        if (cancelled) return;
        setProductResults(results);
        setLastFetchedAt(new Date());
        if (errors.length && errors.length === results.length) {
          setDealsError('All deal queries failed. Is the API server running?');
        } else if (errors.length) {
          setDealsError(`${errors.length} of ${results.length} queries failed.`);
        }
      } catch (err) {
        if (!cancelled) {
          setProductsError(err?.message || 'Failed to load products');
          setProductsLoading(false);
        }
      } finally {
        if (!cancelled) setDealsLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const allDeals = useMemo(() => {
    const out = [];
    for (const entry of productResults) {
      if (!entry) continue;
      const { product, benchmark, listings } = entry;
      if (!listings?.length) continue;
      const fairValue = Number(benchmark?.value) || 0;
      const cat = product?.category || 'Other';
      const imageKind = CATEGORY_IMAGE_MAP[cat] || 'ssd';
      for (const raw of listings) {
        const price = Number(raw.price) || 0;
        const id = stableId(raw.listing_url, raw.title);
        const conditionLabel = raw.condition_description || raw.condition_category || 'Other';
        const conditionBucket = normalizeCondition(
          raw.condition_description || raw.condition_category,
        );
        const discountPct = Number(raw.discount_pct);
        const apiPct = Number.isFinite(discountPct) ? discountPct : null;
        out.push({
          id,
          title: raw.title || 'Untitled listing',
          listing_url: raw.listing_url || null,
          price,
          fairValue,
          dollarsSaved: fairValue > 0 ? fairValue - price : 0,
          discountPct: apiPct ?? (fairValue > 0 ? ((fairValue - price) / fairValue) * 100 : 0),
          category: cat,
          condition: conditionLabel,
          conditionBucket,
          conditionCategory: raw.condition_category || null,
          conditionDescription: raw.condition_description || null,
          image: imageKind,
          queryName: raw.query_name || product?.name || null,
          queryText: raw.api_query_text || product?.query || null,
          fetchedAt: raw.fetched_at || null,
          currency: raw.currency || 'USD',
          marketplaceId: raw.marketplace_id || null,
          benchmark,
          productName: product?.name || null,
        });
      }
    }
    return out;
  }, [productResults]);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    for (const deal of allDeals) {
      counts.set(deal.category, (counts.get(deal.category) || 0) + 1);
    }
    return counts;
  }, [allDeals]);

  const categories = useMemo(() => {
    const entries = [{ id: 'all', label: 'All deals', count: allDeals.length }];
    const seen = new Set();
    for (const product of products) {
      const cat = product?.category;
      if (!cat || seen.has(cat)) continue;
      seen.add(cat);
      entries.push({ id: cat, label: cat, count: categoryCounts.get(cat) || 0 });
    }
    return entries;
  }, [products, categoryCounts, allDeals.length]);

  const productOptions = useMemo(() => {
    if (category === 'all') return [];
    const counts = new Map();
    for (const deal of allDeals) {
      if (deal.category !== category) continue;
      const name = deal.productName;
      if (!name) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name));
  }, [allDeals, category]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = allDeals.filter((deal) => {
      if (category !== 'all' && deal.category !== category) return false;
      if (productName && deal.productName !== productName) return false;
      if (q) {
        const hay = `${deal.title} ${deal.queryName || ''} ${deal.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (condition !== 'any' && deal.conditionBucket !== condition) return false;
      if (minSavings > 0 && deal.discountPct < minSavings) return false;
      return true;
    });

    out.sort((a, b) => {
      let av;
      let bv;
      if (sortKey === 'pct') {
        av = a.discountPct;
        bv = b.discountPct;
      } else if (sortKey === 'dollars') {
        av = a.dollarsSaved;
        bv = b.dollarsSaved;
      } else if (sortKey === 'price') {
        av = a.price;
        bv = b.price;
      } else if (sortKey === 'title') {
        return sortDir === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });

    return out;
  }, [allDeals, category, productName, search, condition, minSavings, sortKey, sortDir]);

  const stats = useMemo(() => {
    const count = filtered.length;
    const totalDollars = filtered.reduce((s, d) => s + (d.dollarsSaved || 0), 0);
    const avgPct = count ? filtered.reduce((s, d) => s + (d.discountPct || 0), 0) / count : 0;
    const universe = allDeals.length;
    return { count, totalDollars, avgPct, universe };
  }, [filtered, allDeals.length]);

  const benchmarkMeta = useMemo(() => {
    for (const entry of productResults) {
      if (entry?.benchmark) return entry.benchmark;
    }
    return null;
  }, [productResults]);

  const onSort = useCallback((key) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prevKey;
      }
      // Smart defaults: ascending for price/title (lowest/A-Z first),
      // descending for savings metrics (largest first).
      setSortDir(key === 'price' || key === 'title' ? 'asc' : 'desc');
      return key;
    });
  }, []);

  return {
    // loading / errors
    productsLoading,
    productsError,
    dealsLoading,
    dealsError,

    // data
    products,
    categories,
    productOptions,
    deals: filtered,
    stats,
    benchmarkMeta,
    lastFetchedAt,

    // filter state
    search,
    setSearch,
    category,
    setCategory,
    productName,
    setProductName,
    minSavings,
    setMinSavings,
    condition,
    setCondition,
    sortKey,
    sortDir,
    onSort,
  };
}

export { savingsFromListing };
