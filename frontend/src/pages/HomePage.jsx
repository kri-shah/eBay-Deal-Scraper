import { Link } from 'react-router-dom';
import { useDealsSearch } from '../hooks/useDealsSearch';
import { FiltersBar } from '../components/FiltersBar';
import { DealsList } from '../components/DealsList';
import { HowDealsWork } from '../components/HowDealsWork';
import { ThemeToggle } from '../components/ThemeToggle';

export function HomePage() {
  const {
    categories,
    items,
    productsLoading,
    productsError,
    selectedCategory,
    setSelectedCategory,
    selectedItem,
    setSelectedItem,
    canSearch,
    deals,
    benchmark,
    dealsLoading,
    dealsError,
    hasSearched,
    sortBy,
    sortOrder,
    toggleSort,
    search,
    clearError,
  } = useDealsSearch();

  const error = productsError || dealsError;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header 
        className="backdrop-blur-sm sticky top-0 z-10"
        style={{ 
          borderBottom: '1px solid var(--border-muted)',
          backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>PriceIntel</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--signal-green-soft)' }}></span>
                Live data
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Market Price Analysis
          </h1>
          <p className="text-base max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Identify statistically underpriced eBay listings using trimmed median benchmarks.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div 
            className="mb-8 rounded-[10px] p-4 flex items-center gap-3"
            style={{ 
              backgroundColor: 'var(--signal-red-bg)',
              border: '1px solid color-mix(in srgb, var(--signal-red) 40%, transparent)',
            }}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--signal-red-bg)' }}
            >
              <svg className="w-4 h-4" style={{ color: 'var(--signal-red)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm flex-1" style={{ color: 'var(--signal-red)' }}>{error}</span>
            <button 
              onClick={clearError} 
              className="p-1 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Filters Section */}
        <section className="mb-6">
          <FiltersBar
            categories={categories}
            items={items}
            selectedCategory={selectedCategory}
            selectedItem={selectedItem}
            onCategoryChange={setSelectedCategory}
            onItemChange={setSelectedItem}
            onSearch={search}
            canSearch={canSearch}
            loading={dealsLoading}
            productsLoading={productsLoading}
          />
        </section>

        {/* How Deals Work Section */}
        <section className="mb-10">
          <HowDealsWork />
        </section>

        {/* Results Section */}
        <section 
          className="rounded-xl p-6"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-muted)',
          }}
        >
          <DealsList
            deals={deals}
            benchmark={benchmark}
            loading={dealsLoading}
            hasSearched={hasSearched}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12" style={{ borderTop: '1px solid var(--border-muted)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>
            PriceIntel · Quantitative pricing intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
