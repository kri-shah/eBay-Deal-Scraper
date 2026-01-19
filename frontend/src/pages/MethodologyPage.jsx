import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export function MethodologyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header 
        className="backdrop-blur-sm sticky top-0 z-10"
        style={{ 
          borderBottom: '1px solid var(--border-muted)',
          backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>PriceIntel</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-sm transition-colors flex items-center gap-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to analysis
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="space-y-12">
          {/* Page Title */}
          <header>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Pricing Methodology
            </h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Technical documentation for our statistical pricing model.
            </p>
          </header>

          {/* TL;DR Section */}
          <section 
            className="rounded-[10px] p-5"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-muted)',
            }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--accent-blue-bg)' }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--accent-blue)' }}>Summary</h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  We scan eBay every 30 minutes, calculate a trimmed median market price for each product, 
                  and surface listings priced 20–65% below that benchmark.
                </p>
              </div>
            </div>
          </section>

          {/* Continuous Market Scanning */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span 
                className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >1</span>
              Data Collection
            </h2>
            <div className="space-y-3 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Every 30 minutes, we query eBay's Browse API for active listings across tracked product categories. 
                This frequency balances API rate limits with the need to capture time-sensitive pricing anomalies.
              </p>
              <p>
                Each scan pulls listing prices, condition data, seller information, and listing metadata. 
                We store historical price data to track market trends over time.
              </p>
            </div>
          </section>

          {/* Trimmed Median Pricing */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span 
                className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >2</span>
              Trimmed Median Calculation
            </h2>
            <div className="space-y-3 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                We calculate a <span className="font-medium" style={{ color: 'var(--text-primary)' }}>trimmed median</span> rather than a simple average. 
                This statistical method removes the top and bottom 15% of prices before computing the median, 
                making our benchmark resistant to:
              </p>
              <ul className="list-none space-y-2 ml-0">
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Outlier prices from damaged or parts-only listings
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Inflated "test" listings from sellers
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Pricing errors (e.g., $1 or $99,999 listings)
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Bulk lots that skew per-unit pricing
                </li>
              </ul>
              <p>
                The trimmed median represents what a typical buyer would actually pay for a product in normal market conditions.
              </p>
            </div>
          </section>

          {/* Deal Qualification Logic */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span 
                className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >3</span>
              Signal Detection
            </h2>
            <div className="space-y-4 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                A listing is flagged as underpriced when its price falls within a specific range below the trimmed median:
              </p>
              
              {/* Code Block */}
              <div 
                className="rounded-lg p-4 font-mono text-sm"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-blue)' }}>price</span>
                  <span style={{ color: 'var(--text-muted)' }}> {'<'} </span>
                  <span style={{ color: 'var(--signal-amber)' }}>0.80</span>
                  <span style={{ color: 'var(--text-muted)' }}> × </span>
                  <span style={{ color: 'var(--accent-blue)' }}>trimmed_median</span>
                </div>
                <div className="my-1.5 text-xs" style={{ color: 'var(--text-disabled)' }}>AND</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-blue)' }}>price</span>
                  <span style={{ color: 'var(--text-muted)' }}> {'>'} </span>
                  <span style={{ color: 'var(--signal-amber)' }}>0.35</span>
                  <span style={{ color: 'var(--text-muted)' }}> × </span>
                  <span style={{ color: 'var(--accent-blue)' }}>trimmed_median</span>
                </div>
              </div>

              <p>
                This means a deal must be priced at least <span className="font-medium" style={{ color: 'var(--text-primary)' }}>20% below market value</span>, 
                but no more than <span className="font-medium" style={{ color: 'var(--text-primary)' }}>65% below</span>.
              </p>
            </div>
          </section>

          {/* Why These Thresholds */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span 
                className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >4</span>
              Threshold Rationale
            </h2>
            <div className="space-y-4 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div>
                <h3 className="font-medium mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>Upper bound (80% of median)</h3>
                <p>
                  Ensures listings are meaningfully discounted. A 20% or greater discount represents genuine value, 
                  not normal price variance or minor seller markdowns.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>Lower bound (35% of median)</h3>
                <p className="mb-2">
                  Filters out listings that are suspiciously cheap. Prices below 35% of market value typically indicate:
                </p>
                <ul className="list-none space-y-1.5 ml-0">
                  <li className="flex items-start gap-2">
                    <span style={{ color: 'var(--text-disabled)' }}>•</span>
                    Fraudulent listings
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: 'var(--text-disabled)' }}>•</span>
                    Damaged or incomplete items mislabeled as working
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: 'var(--text-disabled)' }}>•</span>
                    Bait-and-switch schemes
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: 'var(--text-disabled)' }}>•</span>
                    Pricing errors the seller will cancel
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Discount Color Encoding */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span 
                className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >5</span>
              Signal Strength Encoding
            </h2>
            <div className="space-y-3 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Discount percentages are color-coded by statistical significance:
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div 
                  className="rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                  }}
                >
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--signal-green-strong)' }}>20–40%</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Standard signal</div>
                </div>
                <div 
                  className="rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                  }}
                >
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--signal-green-medium)' }}>40–60%</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Strong signal</div>
                </div>
                <div 
                  className="rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                  }}
                >
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--signal-green-soft)' }}>60%+</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Exceptional signal</div>
                </div>
              </div>
            </div>
          </section>

          {/* What You See */}
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <span 
                className="w-6 h-6 rounded text-xs flex items-center justify-center font-mono"
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >6</span>
              Data Display
            </h2>
            <div className="space-y-3 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                For each identified listing, we display:
              </p>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Current listing price
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Calculated market benchmark (trimmed median)
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Discount percentage relative to benchmark
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--text-disabled)' }}>•</span>
                  Direct link to the eBay listing
                </li>
              </ul>
              <p>
                We don't editorialize or rank listings subjectively. You see the statistical data; you make the decision.
              </p>
            </div>
          </section>

          {/* Limitations */}
          <section 
            className="rounded-[10px] p-5"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-muted)',
            }}
          >
            <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Known Limitations</h2>
            <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--signal-amber)' }}>•</span>
                Prices update every 30 minutes—some listings may sell before you see them.
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--signal-amber)' }}>•</span>
                We cannot verify item condition beyond what's stated in the listing.
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--signal-amber)' }}>•</span>
                Trimmed median works best with 10+ active listings; low-volume products may have less reliable benchmarks.
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: 'var(--signal-amber)' }}>•</span>
                Always review seller feedback and return policies before purchasing.
              </li>
            </ul>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="mt-12" style={{ borderTop: '1px solid var(--border-muted)' }}>
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>
            PriceIntel · Quantitative pricing intelligence
          </p>
          <Link 
            to="/" 
            className="text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back to analysis
          </Link>
        </div>
      </footer>
    </div>
  );
}
