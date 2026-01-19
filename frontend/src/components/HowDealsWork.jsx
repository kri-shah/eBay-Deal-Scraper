import { Link } from 'react-router-dom';

export function HowDealsWork() {
  return (
    <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-slate-800/80 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
            How deals are found
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We scan eBay every 30 minutes, calculate a trimmed median market price for each product, 
            and surface listings priced 35–80% below that value.
          </p>
          <Link 
            to="/methodology" 
            className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 transition-colors mt-2"
          >
            Learn more
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
