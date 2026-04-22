import { useEffect, useMemo, useState } from 'react';
import { useDealFeed } from '../hooks/useDealFeed';
import { useSaved } from '../hooks/useSaved';
import { Header } from '../components/feed/Header';
import { CategoryTabs } from '../components/feed/CategoryTabs';
import { StatsStrip } from '../components/feed/StatsStrip';
import { FilterRail } from '../components/feed/FilterRail';
import { DealCardGrid } from '../components/feed/DealCardGrid';
import { DealCardList } from '../components/feed/DealCardList';
import { DealTable } from '../components/feed/DealTable';
import { DetailPanel } from '../components/feed/DetailPanel';
import { Icon } from '../components/feed/Icon';
import { fmt } from '../components/feed/format';

const VIEW_STORAGE_KEY = 'feed-view';

function readInitialView() {
  if (typeof window === 'undefined') return 'grid';
  const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
  if (stored === 'grid' || stored === 'list' || stored === 'table') return stored;
  return 'grid';
}

function groupByCategory(deals, categoryOrder) {
  const groups = new Map();
  for (const deal of deals) {
    const key = deal.category || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(deal);
  }
  const orderedKeys = [
    ...categoryOrder.filter((k) => groups.has(k)),
    ...[...groups.keys()].filter((k) => !categoryOrder.includes(k)),
  ];
  return orderedKeys.map((key) => {
    const items = groups.get(key);
    const total = items.reduce((s, d) => s + (d.dollarsSaved || 0), 0);
    const avg = items.length
      ? items.reduce((s, d) => s + (d.discountPct || 0), 0) / items.length
      : 0;
    return { category: key, items, total, avgPct: avg };
  });
}

export function HomePage() {
  const {
    productsLoading,
    productsError,
    dealsLoading,
    dealsError,
    categories,
    deals,
    stats,
    benchmarkMeta,
    lastFetchedAt,
    search,
    setSearch,
    category,
    setCategory,
    minSavings,
    setMinSavings,
    condition,
    setCondition,
    sortKey,
    sortDir,
    onSort,
  } = useDealFeed();

  const { saved, toggleSave } = useSaved();

  const [view, setView] = useState(readInitialView);
  const [openDeal, setOpenDeal] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const categoryOrder = useMemo(
    () => categories.filter((c) => c.id !== 'all').map((c) => c.id),
    [categories],
  );

  const groups = useMemo(() => groupByCategory(deals, categoryOrder), [deals, categoryOrder]);

  const sortLabel =
    sortKey === 'pct'
      ? '% below fair value'
      : sortKey === 'dollars'
      ? '$ savings'
      : sortKey === 'price'
      ? 'price'
      : sortKey;

  const loading = productsLoading || dealsLoading;
  const bannerError = productsError || dealsError;

  const feedTitle = category === 'all' ? 'All deals' : category;
  const feedSubCount =
    category === 'all'
      ? `${groups.length} ${groups.length === 1 ? 'category' : 'categories'} · ${deals.length} listings`
      : `${deals.length} listings`;

  return (
    <div className="feed-app">
      <Header
        search={search}
        onSearchChange={setSearch}
        savedCount={saved.size}
      />
      <CategoryTabs categories={categories} selected={category} onSelect={setCategory} />
      <StatsStrip
        stats={stats}
        benchmarkMeta={benchmarkMeta}
        lastFetchedAt={lastFetchedAt}
        loading={loading}
      />

      {bannerError && (
        <div
          style={{
            padding: '10px 24px',
            background: 'color-mix(in oklch, var(--accent) 8%, var(--bg-sunk))',
            borderBottom: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          {bannerError}
        </div>
      )}

      <main className="main">
        <FilterRail
          minSavings={minSavings}
          onMinSavingsChange={setMinSavings}
          condition={condition}
          onConditionChange={setCondition}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
        />

        <section className="feed-col">
          <div className="feed-head">
            <div className="feed-h-left">
              <h2 className="feed-title">
                {feedTitle} ·<span className="feed-count mono"> {feedSubCount}</span>
              </h2>
              <div className="feed-subtitle">
                Sorted by {sortLabel} · {sortDir}
              </div>
            </div>
            <div className="view-switch">
              <button
                type="button"
                className={view === 'grid' ? 'on' : ''}
                onClick={() => setView('grid')}
                title="Grid"
              >
                <Icon.grid />
              </button>
              <button
                type="button"
                className={view === 'list' ? 'on' : ''}
                onClick={() => setView('list')}
                title="List"
              >
                <Icon.list />
              </button>
              <button
                type="button"
                className={view === 'table' ? 'on' : ''}
                onClick={() => setView('table')}
                title="Table"
              >
                <Icon.table />
              </button>
            </div>
          </div>

          {loading && deals.length === 0 ? (
            <div className="feed-loading">
              <div className="feed-loading-bar" />
              <span className="mono" style={{ fontSize: 11, letterSpacing: '0.08em' }}>
                AGGREGATING DEALS…
              </span>
            </div>
          ) : deals.length === 0 ? (
            <div className="empty">
              <div className="empty-h">No matches</div>
              <div className="empty-sub">Loosen your filters to see more opportunities.</div>
            </div>
          ) : (
            <div className="feed-groups">
              {groups.map((group) => (
                <section key={group.category} className="feed-group">
                  <header className="feed-group-head">
                    <h3 className="feed-group-title">{group.category}</h3>
                    <span className="feed-group-count">
                      {group.items.length} {group.items.length === 1 ? 'listing' : 'listings'}
                    </span>
                    <div className="feed-group-stats">
                      <span>
                        <span className="stat-k-inline">Avg</span>
                        <span className="accent">{fmt.pct(group.avgPct)}</span>
                      </span>
                      <span>
                        <span className="stat-k-inline">Total</span>
                        <span className="accent">{fmt.money(group.total)}</span>
                      </span>
                    </div>
                  </header>

                  {view === 'grid' && (
                    <div className="feed-grid">
                      {group.items.map((deal) => (
                        <DealCardGrid
                          key={deal.id}
                          deal={deal}
                          onOpen={setOpenDeal}
                          saved={saved.has(deal.id)}
                          onToggleSave={toggleSave}
                        />
                      ))}
                    </div>
                  )}
                  {view === 'list' && (
                    <div className="feed-list">
                      {group.items.map((deal) => (
                        <DealCardList
                          key={deal.id}
                          deal={deal}
                          onOpen={setOpenDeal}
                          saved={saved.has(deal.id)}
                          onToggleSave={toggleSave}
                        />
                      ))}
                    </div>
                  )}
                  {view === 'table' && (
                    <DealTable
                      deals={group.items}
                      onOpen={setOpenDeal}
                      savedSet={saved}
                      onToggleSave={toggleSave}
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={onSort}
                    />
                  )}
                </section>
              ))}
            </div>
          )}
        </section>
      </main>

      <DetailPanel
        deal={openDeal}
        onClose={() => setOpenDeal(null)}
        saved={openDeal ? saved.has(openDeal.id) : false}
        onToggleSave={toggleSave}
      />
    </div>
  );
}
