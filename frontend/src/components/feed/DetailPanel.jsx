import { Icon } from './Icon';
import { Placeholder } from './Placeholder';
import { fmt } from './format';

export function DetailPanel({ deal, onClose, saved, onToggleSave }) {
  if (!deal) return null;

  const benchmark = deal.benchmark || null;
  const medianType =
    benchmark?.median_type === 'trimmed_median' ? 'Trimmed median' : 'Median';
  const trimPct = benchmark?.trim_pct ?? null;
  const windowDays = benchmark?.window_days ?? null;
  const computedAt = benchmark?.computed_at || null;

  return (
    <>
      <div className="panel-scrim" onClick={onClose} />
      <aside className="feed-app detail-panel">
        <header className="panel-header">
          <div className="panel-header-top">
            <span className="panel-id mono">{deal.id}</span>
            <div className="panel-header-actions">
              <button
                type="button"
                className={`ghost-btn ${saved ? 'saved' : ''}`}
                onClick={() => onToggleSave(deal.id)}
              >
                <Icon.bookmark filled={saved} size={13} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
              {deal.listing_url && (
                <a
                  className="ghost-btn primary-ghost"
                  href={deal.listing_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon.external size={12} />
                  <span>Open on eBay</span>
                </a>
              )}
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                <Icon.close />
              </button>
            </div>
          </div>
          <h2 className="panel-title">{deal.title}</h2>
          <div className="panel-tags">
            {deal.category && <span className="tag">{deal.category}</span>}
            {deal.condition && <span className="tag">{deal.condition}</span>}
            {deal.productName && <span className="tag">{deal.productName}</span>}
            {deal.marketplaceId && <span className="tag">{deal.marketplaceId}</span>}
          </div>
        </header>

        <div className="panel-hero">
          <div className="panel-media">
            <Placeholder kind={deal.image} aspect="4/3" label={deal.category?.toUpperCase()} />
          </div>
          <div className="panel-price-block">
            {deal.fairValue > 0 && (
              <div className="big-savings">
                <span className="big-pct">{fmt.pct(deal.discountPct)}</span>
                <span className="big-label">below fair value</span>
              </div>
            )}
            <div className="big-price-row">
              <div>
                <div className="panel-k">List price</div>
                <div className="panel-v xl mono">{fmt.money(deal.price)}</div>
              </div>
              <div>
                <div className="panel-k">Fair value</div>
                <div className="panel-v xl mono muted">
                  {deal.fairValue > 0 ? <s>{fmt.money(deal.fairValue)}</s> : '—'}
                </div>
              </div>
              <div>
                <div className="panel-k">Estimated savings</div>
                <div className="panel-v xl mono accent">
                  {deal.fairValue > 0 ? fmt.money(deal.dollarsSaved) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="panel-section grid-2">
          <div className="stat-block">
            <div className="stat-k">Median type</div>
            <div className="stat-v" style={{ fontSize: 14 }}>{medianType}</div>
            <div className="stat-sub">method for fair value estimate</div>
          </div>
          <div className="stat-block">
            <div className="stat-k">Trim %</div>
            <div className="stat-v mono">
              {trimPct != null ? `${trimPct}` : '—'}
              {trimPct != null && <span className="stat-unit">%</span>}
            </div>
            <div className="stat-sub">bottom tail removed</div>
          </div>
          <div className="stat-block">
            <div className="stat-k">Window</div>
            <div className="stat-v mono">
              {windowDays != null ? `${windowDays}` : '—'}
              {windowDays != null && <span className="stat-unit">d</span>}
            </div>
            <div className="stat-sub">rolling lookback</div>
          </div>
          <div className="stat-block">
            <div className="stat-k">Computed</div>
            <div className="stat-v mono" style={{ fontSize: 15 }}>
              {fmt.relativeTime(computedAt)}
            </div>
            <div className="stat-sub">benchmark timestamp</div>
          </div>
        </section>

        <section className="panel-section">
          <h4 className="sec-h4">Listing details</h4>
          <div className="big-price-row">
            <div>
              <div className="panel-k">Product query</div>
              <div className="panel-v">{deal.productName || deal.queryName || '—'}</div>
            </div>
            <div>
              <div className="panel-k">Query text</div>
              <div className="panel-v mono" style={{ fontSize: 12 }}>
                {deal.queryText || '—'}
              </div>
            </div>
            <div>
              <div className="panel-k">Condition category</div>
              <div className="panel-v">{deal.conditionCategory || '—'}</div>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
}
