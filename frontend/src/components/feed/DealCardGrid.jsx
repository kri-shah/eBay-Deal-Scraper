import { Icon } from './Icon';
import { Placeholder } from './Placeholder';
import { fmt } from './format';

export function DealCardGrid({ deal, onOpen, saved, onToggleSave }) {
  return (
    <article className="deal-card grid-card" onClick={() => onOpen(deal)}>
      <div className="card-media">
        <Placeholder kind={deal.image} aspect="4/3" label={deal.category?.toUpperCase()} />
        <button
          type="button"
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(deal.id);
          }}
          aria-label="Save listing"
        >
          <Icon.bookmark filled={saved} size={13} />
        </button>
        {deal.fairValue > 0 && (
          <div className="savings-pill">
            <span className="savings-pct">{fmt.pct(deal.discountPct)}</span>
            <span className="savings-vs">vs fair</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{deal.title}</h3>
        <div className="card-meta">
          <span className="meta-condition">{deal.condition}</span>
          <span className="meta-sep">·</span>
          <span className="meta-id">{deal.id}</span>
        </div>
        <div className="card-price-row">
          <div className="price-stack">
            <span className="price-current">{fmt.money(deal.price)}</span>
            {deal.fairValue > 0 && (
              <span className="price-fair">
                <s>{fmt.money(deal.fairValue)}</s> fair value
              </span>
            )}
          </div>
          {deal.fairValue > 0 && (
            <div className="savings-stack">
              <span className="savings-dollar">{fmt.money(deal.dollarsSaved)}</span>
              <span className="savings-label">saved</span>
            </div>
          )}
        </div>
        <div className="card-footer">
          <span className="foot-seller">{deal.category}</span>
          <span className="foot-dot">·</span>
          <span>{deal.productName || deal.queryName || '—'}</span>
        </div>
      </div>
    </article>
  );
}
