import { useTheme } from '../hooks/useTheme';

/**
 * Get color styles based on discount percentage
 * Color-encoded by strength (market-neutral green scale):
 * 20-40% → soft green
 * 40-60% → medium green
 * 60%+ → strong green (never neon)
 */
function getDiscountColors(discountPct, isDark) {
  if (discountPct >= 60) {
    return {
      bg: isDark ? 'rgba(46, 160, 67, 0.2)' : 'rgba(26, 127, 55, 0.12)',
      border: isDark ? 'rgba(46, 160, 67, 0.4)' : 'rgba(26, 127, 55, 0.3)',
      text: 'var(--signal-green-soft)',
    };
  }
  if (discountPct >= 40) {
    return {
      bg: isDark ? 'rgba(46, 160, 67, 0.15)' : 'rgba(26, 127, 55, 0.1)',
      border: isDark ? 'rgba(46, 160, 67, 0.3)' : 'rgba(26, 127, 55, 0.25)',
      text: 'var(--signal-green-medium)',
    };
  }
  // 20-40% (default threshold)
  return {
    bg: isDark ? 'rgba(35, 134, 54, 0.12)' : 'rgba(17, 99, 41, 0.08)',
    border: isDark ? 'rgba(35, 134, 54, 0.25)' : 'rgba(17, 99, 41, 0.2)',
    text: 'var(--signal-green-strong)',
  };
}

export function DealCard({ deal, benchmark }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const price = Number(deal.price) || 0;
  const discountPct = deal.discount_pct ?? 0;
  const median = benchmark?.value ?? null;
  const colors = getDiscountColors(discountPct, isDark);

  return (
    <a
      href={deal.listing_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 p-4 rounded-[10px] transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-muted)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
        e.currentTarget.style.borderColor = 'var(--border-muted)';
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          {discountPct > 0 && (
            <span 
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tabular-nums"
              style={{
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              -{discountPct.toFixed(1)}%
            </span>
          )}
          {deal.condition && (
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {deal.condition}
            </span>
          )}
        </div>
        <h3 
          className="text-sm truncate transition-colors leading-relaxed group-hover:brightness-125"
          style={{ color: 'var(--text-secondary)' }}
        >
          {deal.title || 'Untitled'}
        </h3>
        {deal.condition_category && (
          <span className="mt-1.5 inline-block text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
            {deal.condition_category}
          </span>
        )}
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="text-right">
          <div className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            ${price.toFixed(2)}
          </div>
          {median && (
            <div className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
              <span className="line-through">${median.toFixed(2)}</span>
              <span className="ml-2" style={{ color: colors.text }}>−${(median - price).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
          }}
        >
          <svg 
            className="w-4 h-4 transition-colors group-hover:scale-110" 
            style={{ color: 'var(--text-muted)' }} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}
