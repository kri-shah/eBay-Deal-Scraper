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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-slate-100">DealFinder</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              Live pricing
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-50 mb-4">
            Find underpriced items
          </h1>
          <p className="text-slate-400 text-lg max-w-lg">
            Discover eBay listings priced significantly below market value.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 bg-red-950/40 border border-red-900/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-red-300 flex-1">{error}</span>
            <button onClick={clearError} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
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
        <section className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 shadow-xl shadow-slate-950/50">
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
      <footer className="border-t border-slate-800/60 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-xs text-slate-600">
            DealFinder · Built for smart shoppers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
