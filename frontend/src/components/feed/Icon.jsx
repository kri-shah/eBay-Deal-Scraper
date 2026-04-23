export const Icon = {
  search: (p = {}) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5" />
      <path d="m11 11 3 3" />
    </svg>
  ),
  grid: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="4.5" height="4.5" />
      <rect x="8" y="1.5" width="4.5" height="4.5" />
      <rect x="1.5" y="8" width="4.5" height="4.5" />
      <rect x="8" y="8" width="4.5" height="4.5" />
    </svg>
  ),
  list: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1.5 3h11M1.5 7h11M1.5 11h11" />
    </svg>
  ),
  table: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="11" height="11" />
      <path d="M1.5 5h11M1.5 8.5h11M5.5 1.5v11" />
    </svg>
  ),
  bookmark: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill={p.filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M3 1.5h8v11L7 9.5l-4 3v-11Z" />
    </svg>
  ),
  close: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m3 3 8 8M11 3l-8 8" />
    </svg>
  ),
  moon: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 8.5A5 5 0 1 1 5.5 2a4 4 0 0 0 6.5 6.5Z" />
    </svg>
  ),
  sun: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="2.5" />
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.8 2.8l1 1M10.2 10.2l1 1M2.8 11.2l1-1M10.2 3.8l1-1" />
    </svg>
  ),
  bell: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3.5 6a3.5 3.5 0 0 1 7 0c0 3 1 4 1 4h-9s1-1 1-4ZM5.5 11.5a1.5 1.5 0 0 0 3 0" />
    </svg>
  ),
  external: (p = {}) => (
    <svg width={p.size || 11} height={p.size || 11} viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 2H2v7h7V7M6 2h3v3M5 6l4-4" />
    </svg>
  ),
  check: (p = {}) => (
    <svg width={p.size || 10} height={p.size || 10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m2 5 2 2 4-4" />
    </svg>
  ),
};
