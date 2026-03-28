import { useState, useCallback } from 'react';
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

  const update = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const handleExport = (type) => {
    if (type === 'csv') exportCSV(data);
    else exportJSON(data);
  };

  const views = { dashboard: Dashboard, projects: Projects, revenue: Revenue, focus: Focus, settings: Settings };
  const View = views[view];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar view={view} setView={setView} onExport={handleExport} />
      <main style={{ marginLeft: 220, flex: 1, padding: '36px 40px', maxWidth: 1100, width: '100%' }}>
        <View data={data} update={update} setView={setView} />
      </main>
    </div>
  );
}
