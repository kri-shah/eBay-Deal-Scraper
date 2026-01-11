import { calculateDiscount } from '../api/client';

export function DealCard({ deal }) {
  const price = Number(deal.price) || 0;
  const median = deal.trimmed_median ? Number(deal.trimmed_median) : null;
  const discount = calculateDiscount(price, median);

  return (
    <a
      href={deal.listing_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 p-4 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-neutral-600 rounded-xl transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          {discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs font-semibold text-emerald-400">
              -{discount}%
            </span>
          )}
          {deal.condition && (
            <span className="text-xs text-neutral-500">
              {deal.condition}
            </span>
          )}
        </div>
        <h3 className="text-sm text-neutral-200 group-hover:text-white truncate transition-colors">
          {deal.title || 'Untitled'}
        </h3>
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="text-right">
          <div className="text-lg font-semibold text-white">
            ${price.toFixed(2)}
          </div>
          {median && (
            <div className="text-xs text-neutral-500">
              <span className="line-through">${median.toFixed(2)}</span>
              <span className="text-emerald-400 ml-2">Save ${(median - price).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="w-8 h-8 bg-neutral-700 group-hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-all">
          <svg className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}
