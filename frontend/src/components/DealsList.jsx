import { DealCard } from './DealCard';

function SortButton({ field, label, sortBy, sortOrder, onSort }) {
  const isActive = sortBy === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        isActive
          ? 'bg-slate-700/50 text-slate-200'
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      {label}
      {isActive && (
        <span className="ml-1 text-cyan-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );
}

export function DealsList({
  deals,
  loading,
  hasSearched,
  sortBy,
  sortOrder,
  onSort,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-4">
          <div className="w-12 h-12 border-2 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
        <span className="text-sm text-slate-400">Finding deals...</span>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm mb-1">Ready to search</p>
        <p className="text-slate-600 text-xs">Select a category and item above</p>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm mb-1">No deals found</p>
        <p className="text-slate-600 text-xs">Try a different item or check back later</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200">{deals.length} deals</span>
          <span className="text-xs text-slate-500">found</span>
        </div>
        <div className="flex items-center gap-1">
          <SortButton field="price" label="Price" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
          <SortButton field="discount" label="Discount" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
        </div>
      </div>

      <div className="space-y-2">
        {deals.map((deal, index) => (
          <DealCard key={deal.listing_url || index} deal={deal} />
        ))}
      </div>
    </div>
  );
}
