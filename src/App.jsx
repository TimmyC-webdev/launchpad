import { useState, useCallback, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Projects from './views/Projects';
import Revenue from './views/Revenue';
import Focus from './views/Focus';
import Settings from './views/Settings';
import { loadData, saveData, exportCSV, exportJSON } from './store';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState(() => loadData());
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const update = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const handleExport = (type) => {
    if (type === 'csv') exportCSV(data);
    else exportJSON(data);
  };

  const handleSetView = (nextView) => {
    setView(nextView);
    setMobileNavOpen(false);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileNavOpen(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const views = {
    dashboard: Dashboard,
    projects: Projects,
    revenue: Revenue,
    focus: Focus,
    settings: Settings,
  };

  const View = views[view];

  return (
    <div className="app-shell">
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button
          className="icon-btn"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="mobile-brand">
          <div className="mobile-brand-dot" />
          <span>LaunchPad</span>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar / drawer */}
      <Sidebar
        view={view}
        setView={handleSetView}
        onExport={handleExport}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <main className="main-content">
        <View data={data} update={update} setView={handleSetView} />
      </main>
    </div>
  );
}