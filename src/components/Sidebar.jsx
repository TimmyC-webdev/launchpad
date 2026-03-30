import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  CheckSquare,
  Settings,
  Download,
  X,
} from 'lucide-react';

const nav = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'focus', label: 'Weekly Focus', icon: CheckSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({
  view,
  setView,
  onExport,
  mobileOpen = false,
  onCloseMobile,
}) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div
            style={{
              padding: '6px 12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                background: 'rgba(110,231,183,0.12)',
                border: '1px solid rgba(110,231,183,0.2)',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#6EE7B7',
                }}
              />
            </div>

            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '-0.02em',
                color: '#F0F0F4',
              }}
            >
              LaunchPad
            </span>

            <button
              className="icon-btn sidebar-close"
              onClick={onCloseMobile}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span className="section-label" style={{ padding: '0 12px', marginBottom: 8 }}>
            Menu
          </span>

          {nav.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`nav-item ${view === id ? 'active' : ''}`}
              onClick={() => setView(id)}
            >
              <Icon size={14} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {label}
              <span className="nav-dot" />
            </div>
          ))}
        </nav>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span className="section-label" style={{ padding: '0 12px', marginBottom: 6 }}>
            Export
          </span>

          {[['CSV', 'csv'], ['JSON', 'json']].map(([label, type]) => (
            <button
              key={type}
              className="btn-ghost"
              onClick={() => onExport(type)}
              style={{
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                textAlign: 'left',
                width: '100%',
              }}
            >
              <Download size={12} strokeWidth={1.8} /> Export as {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}