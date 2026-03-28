import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

export default function Settings({ data, update }) {
  const [form, setForm] = useState({ ...data.settings });
  const [saved, setSaved] = useState(false);

  const save = () => {
    update({ ...data, settings: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetAll = () => {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="animate-in" style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-title" style={{ marginBottom: 4 }}>Preferences</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, margin: 0 }}>Settings</h2>
      </div>

      <div className="card" style={{ padding: '24px 28px', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>General</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#5A5A80', display: 'block', marginBottom: 7 }}>Your name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '10px 14px' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#5A5A80', display: 'block', marginBottom: 7 }}>Currency symbol</label>
            <input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} style={{ width: 80, padding: '10px 14px' }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px 28px', marginBottom: 20, border: '1px solid #3A1A1A' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#FF6B6B', marginBottom: 10 }}>Danger zone</div>
        <p style={{ fontSize: 14, color: '#5A5A80', marginBottom: 16 }}>This will delete all your projects, revenue, and focus data permanently.</p>
        <button onClick={resetAll} style={{ background: '#1A0A0A', border: '1px solid #3A1A1A', color: '#FF6B6B', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 500 }}>
          <Trash2 size={14} /> Reset all data
        </button>
      </div>

      <button className="btn-primary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }} onClick={save}>
        <Save size={16} /> {saved ? 'Saved!' : 'Save settings'}
      </button>
    </div>
  );
}
