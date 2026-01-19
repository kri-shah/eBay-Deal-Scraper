import { DealCard } from './DealCard';

function SortButton({ field, label, sortBy, sortOrder, onSort }) {
  const isActive = sortBy === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
      style={{
        backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
        border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
      }}
    >
      {label}
      {isActive && (
        <span className="ml-1.5" style={{ color: 'var(--accent-blue)' }}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
}

function InfoTooltip({ text }) {
  return (
    <div className="relative inline-block group">
      <div 
        className="w-4 h-4 rounded-full flex items-center justify-center cursor-help transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
        }}
      >
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>?</span>
      </div>
      <div 
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 4px 12px var(--shadow-color)',
        }}
      >
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--border-default)',
          }}
        />
      </div>
    </div>
  );
}

function BenchmarkSummary({ benchmark }) {
  if (!benchmark) return null;

  const medianTypeLabel = benchmark.median_type === 'trimmed_median' ? 'Trimmed' : 'Standard';
  const trimPctDisplay = benchmark.median_type === 'trimmed_median' && benchmark.trim_pct != null
    ? `${benchmark.trim_pct}%`
    : '—';
  const isTrimmed = benchmark.median_type === 'trimmed_median';

  return (
    <div 
      className="mb-6 p-4 rounded-[10px]"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-muted)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div 
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-blue-bg)' }}
        >
          <svg className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Market Benchmark</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>Median Type</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{medianTypeLabel}</p>
            {isTrimmed && (
              <InfoTooltip text="Calculates the median price after removing extreme outliers (very high or very low prices) to better reflect the typical market value." />
            )}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>Trim %</p>
          <p className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-secondary)' }}>{trimPctDisplay}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>Median Price</p>
          <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--accent-blue)' }}>
            {benchmark.value != null ? `$${benchmark.value.toFixed(2)}` : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DealsList({
  deals,
  benchmark,
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
          <div className="w-10 h-10 rounded-full" style={{ border: '2px solid var(--border-muted)' }}></div>
          <div 
            className="absolute top-0 left-0 w-10 h-10 rounded-full animate-spin"
            style={{ 
              border: '2px solid transparent',
              borderTopColor: 'var(--accent-blue-muted)',
            }}
          ></div>
        </div>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Analyzing market data...</span>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-muted)',
          }}
        >
          <svg className="w-6 h-6" style={{ color: 'var(--text-disabled)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Ready to analyze</p>
        <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>Select a category and item above</p>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-muted)',
          }}
        >
          <svg className="w-6 h-6" style={{ color: 'var(--text-disabled)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
          </svg>
        </div>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>No underpriced listings found</p>
        <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>Try a different item or check back later</p>
      </div>
    );
  }

  return (
    <div>
      <BenchmarkSummary benchmark={benchmark} />

      <div 
        className="flex items-center justify-between mb-5 pb-4"
        style={{ borderBottom: '1px solid var(--border-muted)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>{deals.length}</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>listings below market</span>
        </div>
        <div className="flex items-center gap-1">
          <SortButton field="price" label="Price" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
          <SortButton field="discount" label="Discount" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
        </div>
      </div>

      <div className="space-y-2">
        {deals.map((deal, index) => (
          <DealCard key={deal.listing_url || index} deal={deal} benchmark={benchmark} />
        ))}
      </div>
    </div>
  );
}
