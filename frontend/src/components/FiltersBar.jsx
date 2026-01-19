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

  const selectStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
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
              className="w-full h-12 px-4 rounded-[10px] text-sm appearance-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={selectStyle}
            >
              <option value="" style={{ color: 'var(--text-muted)' }}>
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
                <svg className="animate-spin h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full h-12 px-4 rounded-[10px] text-sm appearance-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={selectStyle}
            >
              <option value="" style={{ color: 'var(--text-muted)' }}>
                {!selectedCategory ? 'Select category first' : 'Select item'}
              </option>
              {items.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={!canSearch || loading}
          className="h-12 px-8 text-white text-sm font-semibold rounded-[10px] focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{
            backgroundColor: 'var(--signal-green-strong)',
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing
            </span>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </form>
  );
}
