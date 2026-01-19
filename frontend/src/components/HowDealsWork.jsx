import { Link } from 'react-router-dom';

export function HowDealsWork() {
  return (
    <div 
      className="rounded-[10px] px-5 py-4"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-muted)',
      }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <svg className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            className="text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Methodology
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We scan eBay every 30 minutes, calculate a trimmed median market price for each product, 
            and surface listings priced 20–65% below that benchmark.
          </p>
          <Link 
            to="/methodology" 
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors mt-2"
            style={{ color: 'var(--accent-blue)' }}
          >
            View full methodology
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
