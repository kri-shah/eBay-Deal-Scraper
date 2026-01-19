import { Link } from 'react-router-dom';

export function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-slate-100">DealFinder</span>
            </Link>
            <Link 
              to="/" 
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to search
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="space-y-12">
          {/* Page Title */}
          <header>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50 mb-4">
              How We Find Deals
            </h1>
            <p className="text-slate-400 text-lg">
              A technical overview of our pricing methodology.
            </p>
          </header>

          {/* TL;DR Section */}
          <section className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2">TL;DR</h2>
                <p className="text-slate-300 leading-relaxed">
                  We scan eBay every 30 minutes, calculate a trimmed median market price for each product, 
                  and surface listings priced 35–80% below that value.
                </p>
              </div>
            </div>
          </section>

          {/* Continuous Market Scanning */}
          <section>
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-400">1</span>
              Continuous Market Scanning
            </h2>
            <div className="text-slate-400 space-y-3 leading-relaxed">
              <p>
                Every 30 minutes, we query eBay's API for active listings across tracked product categories. 
                This frequency balances API rate limits with the need to catch time-sensitive deals before they sell.
              </p>
              <p>
                Each scan pulls listing prices, condition data, seller information, and listing metadata. 
                We store historical price data to track market trends over time.
              </p>
            </div>
          </section>

          {/* Trimmed Median Pricing */}
          <section>
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-400">2</span>
              Trimmed Median Pricing
            </h2>
            <div className="text-slate-400 space-y-3 leading-relaxed">
              <p>
                We calculate a <span className="text-slate-200 font-medium">trimmed median</span> rather than a simple average. 
                This statistical method removes the top and bottom 10% of prices before computing the median, 
                making our benchmark resistant to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Outlier prices from damaged or parts-only listings</li>
                <li>Inflated "test" listings from sellers</li>
                <li>Pricing errors (e.g., $1 or $99,999 listings)</li>
                <li>Bulk lots that skew per-unit pricing</li>
              </ul>
              <p>
                The trimmed median represents what a typical buyer would actually pay for a product in normal market conditions.
              </p>
            </div>
          </section>

          {/* Deal Qualification Logic */}
          <section>
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-400">3</span>
              Deal Qualification Logic
            </h2>
            <div className="text-slate-400 space-y-4 leading-relaxed">
              <p>
                A listing qualifies as a "deal" when its price falls within a specific range below the trimmed median:
              </p>
              
              {/* Code Block */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-300">
                  <span className="text-cyan-400">price</span>
                  <span className="text-slate-500"> &lt; </span>
                  <span className="text-orange-400">0.80</span>
                  <span className="text-slate-500"> × </span>
                  <span className="text-cyan-400">trimmed_median</span>
                </div>
                <div className="text-slate-500 my-1">AND</div>
                <div className="text-slate-300">
                  <span className="text-cyan-400">price</span>
                  <span className="text-slate-500"> &gt; </span>
                  <span className="text-orange-400">0.35</span>
                  <span className="text-slate-500"> × </span>
                  <span className="text-cyan-400">trimmed_median</span>
                </div>
              </div>

              <p>
                This means a deal must be priced at least <span className="text-slate-200 font-medium">20% below market value</span>, 
                but no more than <span className="text-slate-200 font-medium">65% below</span>.
              </p>
            </div>
          </section>

          {/* Why These Thresholds */}
          <section>
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-400">4</span>
              Why These Thresholds
            </h2>
            <div className="text-slate-400 space-y-4 leading-relaxed">
              <div>
                <h3 className="text-slate-200 font-medium mb-2">Upper bound (80% of median)</h3>
                <p>
                  Ensures listings are meaningfully discounted. A 20% or greater discount represents genuine value, 
                  not normal price variance or minor seller markdowns.
                </p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-2">Lower bound (35% of median)</h3>
                <p>
                  Filters out listings that are suspiciously cheap. Prices below 35% of market value typically indicate:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Scam listings (item won't be shipped)</li>
                  <li>Broken, damaged, or incomplete items mislabeled as working</li>
                  <li>Bait-and-switch schemes</li>
                  <li>Pricing errors the seller will cancel</li>
                </ul>
              </div>
            </div>
          </section>

          {/* What You See */}
          <section>
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-400">5</span>
              What You See
            </h2>
            <div className="text-slate-400 space-y-3 leading-relaxed">
              <p>
                For each deal, we display:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Current listing price</li>
                <li>Calculated market benchmark (trimmed median)</li>
                <li>Discount percentage relative to benchmark</li>
                <li>Direct link to the eBay listing</li>
              </ul>
              <p>
                We don't editorialize or rank deals by "quality." You see the data; you decide what's worth buying.
              </p>
            </div>
          </section>

          {/* Limitations */}
          <section className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-3">Limitations</h2>
            <ul className="text-slate-400 space-y-2 text-sm leading-relaxed">
              <li>
                <span className="text-slate-300">•</span> Prices update every 30 minutes—some deals may sell before you see them.
              </li>
              <li>
                <span className="text-slate-300">•</span> We can't verify item condition beyond what's stated in the listing.
              </li>
              <li>
                <span className="text-slate-300">•</span> Trimmed median works best with 10+ active listings; low-volume products may have less reliable benchmarks.
              </li>
              <li>
                <span className="text-slate-300">•</span> Always review seller feedback and return policies before purchasing.
              </li>
            </ul>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            DealFinder · Built for smart shoppers
          </p>
          <Link 
            to="/" 
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to search
          </Link>
        </div>
      </footer>
    </div>
  );
}
