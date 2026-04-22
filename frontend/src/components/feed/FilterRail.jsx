const CONDITIONS = [
  { id: 'any', label: 'any' },
  { id: 'new', label: 'new' },
  { id: 'used', label: 'used' },
  { id: 'other', label: 'other' },
];

const SORT_OPTIONS = [
  { k: 'pct', l: '% below fair value' },
  { k: 'dollars', l: '$ savings' },
  { k: 'price', l: 'Price' },
];

export function FilterRail({
  minSavings,
  onMinSavingsChange,
  condition,
  onConditionChange,
  sortKey,
  sortDir,
  onSort,
}) {
  return (
    <aside className="filter-rail">
      <div className="rail-section">
        <div className="rail-h">Discount</div>
        <div className="rail-slider">
          <div className="slider-head mono">
            <span>≥ {minSavings}% off</span>
            <span className="slider-max">50%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={minSavings}
            onChange={(e) => onMinSavingsChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="rail-section">
        <div className="rail-h">Condition</div>
        <div className="pill-group">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`pill ${condition === c.id ? 'on' : ''}`}
              onClick={() => onConditionChange(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rail-section">
        <div className="rail-h">Sort</div>
        <div className="sort-list">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.k}
              type="button"
              className={`sort-row ${sortKey === s.k ? 'on' : ''}`}
              onClick={() => onSort(s.k)}
            >
              <span>{s.l}</span>
              {sortKey === s.k && <span className="mono">{sortDir === 'desc' ? '↓' : '↑'}</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
