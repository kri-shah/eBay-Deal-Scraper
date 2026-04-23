import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/feed/Header';
import { useSaved } from '../hooks/useSaved';

export function MethodologyPage() {
  const [search, setSearch] = useState('');
  const { saved } = useSaved();

  return (
    <div className="feed-app">
      <Header search={search} onSearchChange={setSearch} savedCount={saved.size} />

      <main className="method-page">
        <div className="method-page-inner">
          <article className="method-doc">
            <header>
              <h1>Pricing methodology</h1>
              <p className="lead">
                Technical documentation for the statistical pricing model behind the deal feed.
              </p>
            </header>

            <section className="method-summary" aria-label="Summary">
              <div className="method-summary-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2>Summary</h2>
                <p>
                  We scan eBay every 30 minutes, calculate a trimmed median market price for each product,
                  and surface listings priced 20–65% below that benchmark.
                </p>
              </div>
            </section>

            <section className="method-section">
              <h2>
                <span className="method-step-num">1</span>
                Data collection
              </h2>
              <div className="method-prose">
                <p>
                  Every 30 minutes, we query eBay&apos;s Browse API for active listings across tracked product
                  categories. This frequency balances API rate limits with the need to capture time-sensitive
                  pricing anomalies.
                </p>
                <p>
                  Each scan pulls listing prices, condition data, seller information, and listing metadata. We
                  store historical price data to track market trends over time.
                </p>
              </div>
            </section>

            <section className="method-section">
              <h2>
                <span className="method-step-num">2</span>
                Trimmed median calculation
              </h2>
              <div className="method-prose">
                <p>
                  We calculate a <strong>trimmed median</strong> rather than a simple average. This statistical
                  method removes the top and bottom 15% of prices before computing the median, making our
                  benchmark resistant to:
                </p>
                <ul className="method-ul">
                  <li>Outlier prices from damaged or parts-only listings</li>
                  <li>Inflated &quot;test&quot; listings from sellers</li>
                  <li>Pricing errors (e.g., $1 or $99,999 listings)</li>
                  <li>Bulk lots that skew per-unit pricing</li>
                </ul>
                <p>
                  The trimmed median represents what a typical buyer would actually pay for a product in normal
                  market conditions.
                </p>
              </div>
            </section>

            <section className="method-section">
              <h2>
                <span className="method-step-num">3</span>
                Signal detection
              </h2>
              <div className="method-prose">
                <p>A listing is flagged as underpriced when its price falls within a specific range below the trimmed median:</p>
                <div className="method-code">
                  <div>
                    <span className="kw">price</span> <span className="op">&lt;</span>{' '}
                    <span className="lit">0.80</span> <span className="op">×</span> <span className="kw">trimmed_median</span>
                  </div>
                  <div className="and">AND</div>
                  <div>
                    <span className="kw">price</span> <span className="op">&gt;</span>{' '}
                    <span className="lit">0.35</span> <span className="op">×</span> <span className="kw">trimmed_median</span>
                  </div>
                </div>
                <p>
                  This means a deal must be priced at least <strong>20% below market value</strong>, but no more
                  than <strong>65% below</strong>.
                </p>
              </div>
            </section>

            <section className="method-section">
              <h2>
                <span className="method-step-num">4</span>
                Threshold rationale
              </h2>
              <div className="method-prose">
                <div className="method-subblock">
                  <h3 className="method-h3">Upper bound (80% of median)</h3>
                  <p>
                    Ensures listings are meaningfully discounted. A 20% or greater discount represents genuine
                    value, not normal price variance or minor seller markdowns.
                  </p>
                </div>
                <div className="method-subblock">
                  <h3 className="method-h3">Lower bound (35% of median)</h3>
                  <p>Filters out listings that are suspiciously cheap. Prices below 35% of market value typically indicate:</p>
                  <ul className="method-ul">
                    <li>Fraudulent listings</li>
                    <li>Damaged or incomplete items mislabeled as working</li>
                    <li>Bait-and-switch schemes</li>
                    <li>Pricing errors the seller will cancel</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="method-section">
              <h2>
                <span className="method-step-num">5</span>
                Signal strength encoding
              </h2>
              <div className="method-prose">
                <p>Discount percentages are color-coded by statistical significance:</p>
                <div className="method-signal-grid">
                  <div className="method-signal-cell">
                    <div className="method-signal-pct a">20–40%</div>
                    <div className="method-signal-label">Standard signal</div>
                  </div>
                  <div className="method-signal-cell">
                    <div className="method-signal-pct b">40–60%</div>
                    <div className="method-signal-label">Strong signal</div>
                  </div>
                  <div className="method-signal-cell">
                    <div className="method-signal-pct c">60%+</div>
                    <div className="method-signal-label">Exceptional signal</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="method-section">
              <h2>
                <span className="method-step-num">6</span>
                Data display
              </h2>
              <div className="method-prose">
                <p>For each identified listing, we display:</p>
                <ul className="method-ul">
                  <li>Current listing price</li>
                  <li>Calculated market benchmark (trimmed median)</li>
                  <li>Discount percentage relative to benchmark</li>
                  <li>Direct link to the eBay listing</li>
                </ul>
                <p>
                  We don&apos;t editorialize or rank listings subjectively. You see the statistical data; you make
                  the decision.
                </p>
              </div>
            </section>

            <section className="method-limitations" aria-label="Known limitations">
              <h2>Known limitations</h2>
              <ul className="method-ul method-ul-warn">
                <li>Prices update every 30 minutes—some listings may sell before you see them.</li>
                <li>We cannot verify item condition beyond what&apos;s stated in the listing.</li>
                <li>Trimmed median works best with 10+ active listings; low-volume products may have less reliable benchmarks.</li>
                <li>Always review seller feedback and return policies before purchasing.</li>
              </ul>
            </section>
          </article>
        </div>
      </main>

      <footer className="method-footer">
        <div className="method-footer-inner">
          <p className="method-footer-note mono">eBay Deal Scraper · quantitative pricing signals</p>
          <Link to="/" className="method-footer-back">
            ← Back to deal feed
          </Link>
        </div>
      </footer>
    </div>
  );
}
