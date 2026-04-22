const svgProps = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

const ART = {
  laptop: (s) => (
    <svg {...svgProps(s)}>
      <rect x="8" y="10" width="32" height="21" rx="2" />
      <path d="M4 34h40l-2.5 4.5H6.5z" />
      <path d="M20 34h8" />
    </svg>
  ),
  headphones: (s) => (
    <svg {...svgProps(s)}>
      <path d="M8 28v-4a16 16 0 0 1 32 0v4" />
      <rect x="6" y="28" width="8" height="12" rx="2" />
      <rect x="34" y="28" width="8" height="12" rx="2" />
    </svg>
  ),
  earbuds: (s) => (
    <svg {...svgProps(s)}>
      <path d="M14 10c-4 1-7 5-7 11 0 5 3 8 6 8 2 0 3-2 3-4v-9c0-3-1-6-2-6z" />
      <path d="M34 10c4 1 7 5 7 11 0 5-3 8-6 8-2 0-3-2-3-4v-9c0-3 1-6 2-6z" />
      <circle cx="11" cy="33" r="3" />
      <circle cx="37" cy="33" r="3" />
    </svg>
  ),
  tablet: (s) => (
    <svg {...svgProps(s)}>
      <rect x="10" y="5" width="28" height="38" rx="3" />
      <path d="M22 39h4" />
      <path d="M14 10h20v24H14z" />
    </svg>
  ),
  gpu: (s) => (
    <svg {...svgProps(s)}>
      <rect x="4" y="14" width="40" height="18" rx="2" />
      <circle cx="15" cy="23" r="4" />
      <circle cx="30" cy="23" r="4" />
      <path d="M4 32v4h6v-4M38 32v4h6v-4" />
      <path d="M44 20h2M44 26h2" />
    </svg>
  ),
  camera: (s) => (
    <svg {...svgProps(s)}>
      <path d="M6 14h8l3-4h14l3 4h8v22H6z" />
      <circle cx="24" cy="25" r="7" />
      <circle cx="24" cy="25" r="3" />
      <circle cx="38" cy="19" r="1" />
    </svg>
  ),
  ssd: (s) => (
    <svg {...svgProps(s)}>
      <rect x="8" y="10" width="32" height="28" rx="2" />
      <path d="M14 16h20M14 22h20M14 28h12" />
      <circle cx="32" cy="30" r="1.5" fill="currentColor" />
    </svg>
  ),
  watch: (s) => (
    <svg {...svgProps(s)}>
      <rect x="14" y="14" width="20" height="20" rx="3" />
      <path d="M18 14l2-6h8l2 6M18 34l2 6h8l2-6" />
      <path d="M24 20v5l3 2" />
    </svg>
  ),
  drone: (s) => (
    <svg {...svgProps(s)}>
      <circle cx="10" cy="12" r="4" />
      <circle cx="38" cy="12" r="4" />
      <circle cx="10" cy="36" r="4" />
      <circle cx="38" cy="36" r="4" />
      <path d="M10 12l8 8M38 12l-8 8M10 36l8-8M38 36l-8-8" />
      <rect x="18" y="18" width="12" height="12" rx="2" />
    </svg>
  ),
  steamdeck: (s) => (
    <svg {...svgProps(s)}>
      <path d="M4 18c0-3 2-5 5-5h30c3 0 5 2 5 5v10c0 3-2 5-5 5h-6l-3 4H17l-3-4H9c-3 0-5-2-5-5z" />
      <circle cx="12" cy="23" r="2.5" />
      <rect x="18" y="21" width="12" height="5" rx="1" />
      <circle cx="36" cy="21" r="1.3" fill="currentColor" />
      <circle cx="40" cy="24" r="1.3" fill="currentColor" />
      <circle cx="36" cy="27" r="1.3" fill="currentColor" />
      <circle cx="32" cy="24" r="1.3" fill="currentColor" />
    </svg>
  ),
  tv: (s) => (
    <svg {...svgProps(s)}>
      <rect x="4" y="8" width="40" height="26" rx="2" />
      <path d="M18 40h12M24 34v6" />
    </svg>
  ),
  kindle: (s) => (
    <svg {...svgProps(s)}>
      <rect x="10" y="6" width="28" height="36" rx="2" />
      <path d="M14 12h20v22H14z" />
      <circle cx="24" cy="38" r="1.3" fill="currentColor" />
    </svg>
  ),
};

export function CategoryArt({ kind, size = 72 }) {
  const render = ART[kind];
  if (!render) return null;
  return <div className="placeholder-art">{render(size)}</div>;
}

export function hasCategoryArt(kind) {
  return Boolean(ART[kind]);
}
