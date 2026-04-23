import { Icon } from './Icon';
import { fmt } from './format';

const COLUMNS = [
  { k: 'id', label: 'ID', align: 'left', sortable: false },
  { k: 'title', label: 'Listing', align: 'left', sortable: true },
  { k: 'condition', label: 'Cond.', align: 'left', sortable: false },
  { k: 'price', label: 'Price', align: 'right', sortable: true },
  { k: 'fairValue', label: 'Fair', align: 'right', sortable: false },
  { k: 'pct', label: 'Δ %', align: 'right', sortable: true },
  { k: 'dollars', label: 'Δ $', align: 'right', sortable: true },
  { k: 'save', label: '', align: 'center', sortable: false },
];

export function DealTable({ deals, onOpen, savedSet, onToggleSave, sortKey, sortDir, onSort }) {
  return (
    <div className="deal-table-wrap">
      <table className="deal-table">
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.k}
                className={`col-${c.k} ${c.align}`}
                onClick={() => c.sortable && onSort(c.k)}
                style={{ cursor: c.sortable ? 'pointer' : 'default' }}
              >
                <span>{c.label}</span>
                {c.sortable && sortKey === c.k && (
                  <span className="sort-arrow">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => {
            const saved = savedSet.has(deal.id);
            return (
              <tr key={deal.id} onClick={() => onOpen(deal)}>
                <td className="mono col-id">{deal.id}</td>
                <td className="col-title">
                  <div className="table-title">{deal.title}</div>
                  <div className="table-seller">{deal.productName || deal.queryName || deal.category}</div>
                </td>
                <td>{deal.condition}</td>
                <td className="right mono">{fmt.money(deal.price)}</td>
                <td className="right mono muted">
                  {deal.fairValue > 0 ? fmt.money(deal.fairValue) : '—'}
                </td>
                <td className="right mono accent">
                  {deal.fairValue > 0 ? fmt.pct(deal.discountPct) : '—'}
                </td>
                <td className="right mono accent">
                  {deal.fairValue > 0 ? fmt.money(deal.dollarsSaved) : '—'}
                </td>
                <td className="center">
                  <button
                    type="button"
                    className={`save-btn table ${saved ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(deal.id);
                    }}
                    aria-label="Save listing"
                  >
                    <Icon.bookmark filled={saved} size={12} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
