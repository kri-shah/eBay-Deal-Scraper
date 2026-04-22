import { CategoryArt, hasCategoryArt } from './CategoryArt';

const LABELS = {
  laptop: 'LAPTOP',
  headphones: 'AUDIO',
  tablet: 'TABLET',
  gpu: 'GPU',
  camera: 'CAMERA',
  ssd: 'STORAGE',
  watch: 'WEARABLE',
  drone: 'DRONE',
  steamdeck: 'HANDHELD',
  earbuds: 'EARBUDS',
  tv: 'DISPLAY',
  kindle: 'E-READER',
};

export function Placeholder({ kind, aspect = '4/3', label }) {
  const key = kind || 'ssd';
  const patternId = `feed-stripe-${key}`;
  const hasArt = hasCategoryArt(key);
  const labelText = label || LABELS[key] || 'ITEM';

  return (
    <div
      className={`placeholder ${hasArt ? 'has-art' : 'no-art'}`}
      style={{ aspectRatio: aspect }}
    >
      <svg className="placeholder-stripes" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {hasArt && <CategoryArt kind={key} />}
      <span className="placeholder-label">{labelText}</span>
    </div>
  );
}
