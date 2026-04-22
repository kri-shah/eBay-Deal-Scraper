import { fmt } from './format';

export function StatsStrip({ stats, benchmarkMeta, lastFetchedAt, loading }) {
  const methodLabel = benchmarkMeta
    ? `${benchmarkMeta.median_type === 'trimmed_median' ? 'Trimmed median' : 'Median'} · ${
        benchmarkMeta.trim_pct ?? 0
      }% trim · ${benchmarkMeta.window_days ?? 0}d rolling window`
    : 'Trimmed median · 15% trim · 7d rolling window';

  const freshnessSource = benchmarkMeta?.computed_at || lastFetchedAt;
  const freshness = loading && !freshnessSource ? 'syncing' : fmt.relativeTime(freshnessSource);

  return (
    <section className="stats-strip">
      <div className="stats-inner">
        <div className="stat">
          <div className="stat-label">Live deals</div>
          <div className="stat-value mono">
            {Number(stats.count || 0).toLocaleString()}
            <span className="stat-unit">/ {Number(stats.universe || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Avg. discount</div>
          <div className="stat-value mono accent">{fmt.pct(stats.avgPct || 0)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total arbitrage available</div>
          <div className="stat-value mono accent">{fmt.money(stats.totalDollars || 0)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Data freshness</div>
          <div className="stat-value mono">
            <span className="pulse-dot" />
            {freshness}
          </div>
        </div>
        <div className="stats-spacer" />
        <div className="stat-method">
          <span className="method-k mono">METHOD</span>
          <span className="method-v">{methodLabel}</span>
        </div>
      </div>
    </section>
  );
}
