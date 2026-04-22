export function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="cat-tabs">
      <div className="cat-tabs-inner">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-tab ${selected === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <span>{cat.label}</span>
            <span className="cat-count mono">{Number(cat.count || 0).toLocaleString()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
