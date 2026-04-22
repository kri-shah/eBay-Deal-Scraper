export const fmt = {
  money(n) {
    const value = Number(n);
    if (!Number.isFinite(value)) return '—';
    const hasCents = Math.abs(value) % 1 !== 0;
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  },
  pct(n) {
    const value = Number(n);
    if (!Number.isFinite(value)) return '—';
    const sign = value > 0 ? '−' : value < 0 ? '+' : '';
    return `${sign}${Math.abs(Math.round(value))}%`;
  },
  compact(n) {
    const value = Number(n);
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return `${value}`;
  },
  relativeTime(input) {
    if (!input) return '—';
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return '—';
    const diff = Math.max(0, (Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${Math.round(diff)}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
    return `${Math.round(diff / 86400)}d ago`;
  },
};
