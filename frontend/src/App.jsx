import { useDealsSearch } from './hooks/useDealsSearch';
import { FiltersBar } from './components/FiltersBar';
import { DealsList } from './components/DealsList';

function App() {
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
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-neutral-900/50 via-transparent to-neutral-900/30 pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">DealFinder</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live pricing
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Find underpriced items
          </h1>
          <p className="text-neutral-400 text-lg max-w-lg">
            Discover eBay listings priced significantly below market value.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-red-300 flex-1">{error}</span>
            <button onClick={clearError} className="text-neutral-500 hover:text-white transition-colors p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Filters Section */}
        <section className="mb-10">
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

        {/* Results Section */}
        <section className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <DealsList
            deals={deals}
            loading={dealsLoading}
            hasSearched={hasSearched}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-neutral-800 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-xs text-neutral-600">
            DealFinder · Built for smart shoppers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
