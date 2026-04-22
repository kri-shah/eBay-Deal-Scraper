import { Icon } from './Icon';
import { Placeholder } from './Placeholder';
import { fmt } from './format';

export function DealCardList({ deal, onOpen, saved, onToggleSave }) {
  return (
    <article className="deal-card list-card" onClick={() => onOpen(deal)}>
      <div className="list-media">
        <Placeholder kind={deal.image} aspect="1" label={deal.category?.toUpperCase()} />
      </div>
      <div className="list-body">
        <div className="list-main">
          <div className="list-top">
            <h3 className="list-title">{deal.title}</h3>
            <button
              type="button"
              className={`save-btn inline ${saved ? 'saved' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(deal.id);
              }}
              aria-label="Save listing"
            >
              <Icon.bookmark filled={saved} size={13} />
            </button>
          </div>
          <div className="list-meta">
            <span>{deal.id}</span>
            <span className="meta-sep">·</span>
            <span>{deal.condition}</span>
            <span className="meta-sep">·</span>
            <span>{deal.category}</span>
            {deal.productName && (
              <>
                <span className="meta-sep">·</span>
                <span>{deal.productName}</span>
              </>
            )}
          </div>
        </div>
        <div className="list-price">
          <span className="price-current">{fmt.money(deal.price)}</span>
          {deal.fairValue > 0 && (
            <span className="price-fair">
              <s>{fmt.money(deal.fairValue)}</s>
            </span>
          )}
        </div>
        {deal.fairValue > 0 ? (
          <div className="list-savings">
            <span className="savings-dollar">{fmt.money(deal.dollarsSaved)}</span>
            <span className="savings-pct-inline">{fmt.pct(deal.discountPct)}</span>
          </div>
        ) : (
          <div className="list-savings">
            <span className="savings-pct-inline">—</span>
          </div>
        )}
      </div>
    </article>
  );
}
