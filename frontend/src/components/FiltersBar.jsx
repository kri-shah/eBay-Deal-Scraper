export function FiltersBar({
  categories,
  items,
  selectedCategory,
  selectedItem,
  onCategoryChange,
  onItemChange,
  onSearch,
  canSearch,
  loading,
  productsLoading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSearch && !loading) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Dropdown */}
        <div className="flex-1">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={productsLoading}
              className="w-full h-12 px-4 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="">
                {productsLoading ? 'Loading...' : 'Select category'}
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              {productsLoading ? (
                <svg className="animate-spin h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Item Dropdown */}
        <div className="flex-1">
          <div className="relative">
            <select
              value={selectedItem}
              onChange={(e) => onItemChange(e.target.value)}
              disabled={!selectedCategory || productsLoading}
              className="w-full h-12 px-4 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="">
                {!selectedCategory ? 'Select category first' : 'Select item'}
              </option>
              {items.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={!canSearch || loading}
          className="h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
}
