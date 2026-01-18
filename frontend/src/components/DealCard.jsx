/**
 * Get color classes based on discount percentage
 * 20-30%: Good (emerald)
 * 30-40%: Great (cyan)
 * 40-50%: Excellent (blue)
 * 50%+: Exceptional (violet)
 */
function getDiscountColors(discountPct) {
  if (discountPct >= 50) {
    return {
      bg: 'bg-violet-500/15',
      border: 'border-violet-500/30',
      text: 'text-violet-400',
    };
  }
  if (discountPct >= 40) {
    return {
      bg: 'bg-blue-500/15',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
    };
  }
  if (discountPct >= 30) {
    return {
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
    };
  }
  // 20-30% or default
  return {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  };
}

export function DealCard({ deal, benchmark }) {
  const price = Number(deal.price) || 0;
  const discountPct = deal.discount_pct ?? 0;
  const median = benchmark?.value ?? null;
  const colors = getDiscountColors(discountPct);

  return (
    <a
      href={deal.listing_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/40 hover:border-slate-600/50 rounded-xl transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          {discountPct > 0 && (
            <span className={`inline-flex items-center px-2 py-0.5 ${colors.bg} border ${colors.border} rounded-md text-xs font-semibold ${colors.text}`}>
              -{discountPct.toFixed(1)}%
            </span>
          )}
          {deal.condition && (
            <span className="text-xs text-slate-500">
              {deal.condition}
            </span>
          )}
        </div>
        <h3 className="text-sm text-slate-300 group-hover:text-slate-100 truncate transition-colors">
          {deal.title || 'Untitled'}
        </h3>
        {deal.condition_category && (
          <span className="mt-1 inline-block text-xs text-slate-500 capitalize">
            {deal.condition_category}
          </span>
        )}
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="text-right">
          <div className="text-lg font-semibold text-slate-100">
            ${price.toFixed(2)}
          </div>
          {median && (
            <div className="text-xs text-slate-500">
              <span className="line-through">${median.toFixed(2)}</span>
              <span className={`ml-2 ${colors.text}`}>Save ${(median - price).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="w-8 h-8 bg-slate-700/50 group-hover:bg-cyan-500 border border-slate-600/50 group-hover:border-cyan-500 rounded-lg flex items-center justify-center transition-all">
          <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}
