import { Link, NavLink } from 'react-router-dom';
import { Icon } from './Icon';
import { useTheme } from '../../hooks/useTheme';

export function Header({ search, onSearchChange, savedCount = 0 }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <div className="brand-mark">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="8" fill="currentColor" />
              <rect x="12" y="2" width="8" height="8" fill="currentColor" opacity="0.4" />
              <rect x="2" y="12" width="8" height="8" fill="currentColor" opacity="0.65" />
              <rect x="12" y="12" width="8" height="8" fill="var(--accent)" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-name">Deal Scraper</div>
            <div className="brand-sub mono">LIVE</div>
          </div>
        </Link>

        <nav className="top-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Deal feed
          </NavLink>
          <span className="nav-item" aria-disabled="true">
            Watchlist <span className="nav-badge mono">{savedCount}</span>
          </span>
          <NavLink
            to="/methodology"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Methodology
          </NavLink>
        </nav>

        <div className="header-right">
          <div className="search-wrap">
            <Icon.search />
            <input
              placeholder="Search titles, sellers, IDs…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <kbd className="mono">⌘K</kbd>
          </div>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
          </button>
          <button className="icon-btn" aria-label="Alerts">
            <Icon.bell />
          </button>
          <div className="user-chip">
            <span className="user-av">DS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
