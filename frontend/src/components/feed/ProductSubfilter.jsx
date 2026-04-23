export function ProductSubfilter({ category, options, selected, onSelect }) {
  if (category === 'all' || !options || options.length === 0) return null;

  const total = options.reduce((s, o) => s + o.count, 0);

  return (
    <div className="sub-filter">
      <div className="sub-filter-inner">
        <button
          type="button"
          className={`sub-chip ${selected === null ? 'active' : ''}`}
          onClick={() => onSelect(null)}
        >
          <span>All {category}</span>
          <span className="sub-chip-count mono">{total.toLocaleString()}</span>
        </button>
        {options.map((opt) => (
          <button
            key={opt.name}
            type="button"
            className={`sub-chip ${selected === opt.name ? 'active' : ''}`}
            onClick={() => onSelect(opt.name)}
          >
            <span>{opt.name}</span>
            <span className="sub-chip-count mono">{opt.count.toLocaleString()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
