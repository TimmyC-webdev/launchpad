import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Plus, X } from 'lucide-react';

export default function Revenue({ data, update }) {
  const { projects, revenueLog, settings } = data;
  const cur = settings.currency;
  const [form, setForm] = useState({ projectId: projects[0]?.id || '', amount: '', date: new Date().toISOString().slice(0,10), note: '' });

  const addEntry = () => {
    if (!form.amount || !form.projectId) return;
    const entry = { ...form, id: Date.now().toString(), amount: Number(form.amount) };
    const newLog = [...revenueLog, entry];
    // Update project revenue
    const projects2 = projects.map(p =>
      p.id === form.projectId ? { ...p, revenue: p.revenue + Number(form.amount), mrr: p.mrr + Number(form.amount) } : p
    );
    update({ ...data, revenueLog: newLog, projects: projects2 });
    setForm(f => ({ ...f, amount: '', note: '' }));
  };

  const deleteEntry = (id) => {
    update({ ...data, revenueLog: revenueLog.filter(r => r.id !== id) });
  };

  // Monthly aggregation (last 6 months)
  const monthlyData = (() => {
    const months = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = 0;
    }
    revenueLog.forEach(r => {
      const d = new Date(r.date);
      const key = d.toLocaleString('default', { month: 'short' });
      if (months[key] !== undefined) months[key] += r.amount;
    });
    return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
  })();

  const perProject = projects.map(p => ({
    name: p.name, emoji: p.emoji,
    revenue: revenueLog.filter(r => r.projectId === p.id).reduce((s, r) => s + r.amount, 0),
    color: p.color,
  })).filter(p => p.revenue > 0);

  const totalRevenue = revenueLog.reduce((s, r) => s + r.amount, 0);
  const thisMonth = revenueLog.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).reduce((s, r) => s + r.amount, 0);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div className="section-title" style={{ marginBottom: 4 }}>Financials</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, margin: 0 }}>Revenue</h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Revenue', value: `${cur}${totalRevenue}`, color: '#C8F135' },
          { label: 'This Month', value: `${cur}${thisMonth}`, color: '#00F5D4' },
          { label: 'Entries', value: revenueLog.length, color: '#7B61FF' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: 13, color: '#5A5A80', marginBottom: 8 }}>{label}</div>
            <div className="stat-number" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={28}>
              <XAxis dataKey="month" tick={{ fill: '#4A4A70', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1A1A26', border: '1px solid #2E2E45', borderRadius: 10, color: '#E8E8F0', fontSize: 13 }} formatter={v => [`${cur}${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#C8F135" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>By Project</div>
          {perProject.length === 0 ? (
            <div style={{ color: '#4A4A70', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>No revenue logged yet</div>
          ) : perProject.map(p => (
            <div key={p.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>{p.emoji} {p.name}</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: p.color }}>{cur}{p.revenue}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.round(p.revenue / totalRevenue * 100)}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add entry */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Log Revenue</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 140px 1fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Project</label>
            <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} style={{ width: '100%', padding: '9px 12px' }}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Amount ({cur})</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" style={{ width: '100%', padding: '9px 12px' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: '9px 12px' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Note</label>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. First IAP sales" style={{ width: '100%', padding: '9px 12px' }} />
          </div>
          <button className="btn-primary" style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }} onClick={addEntry}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* Log table */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Revenue Log</div>
        {revenueLog.length === 0 ? (
          <div style={{ color: '#4A4A70', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>No entries yet — log your first revenue above!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...revenueLog].reverse().map(r => {
              const proj = projects.find(p => p.id === r.projectId);
              return (
                <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 120px 100px auto', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#1A1A26', borderRadius: 10 }}>
                  <span style={{ fontSize: 18 }}>{proj?.emoji || '📦'}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{proj?.name || 'Unknown'}</div>
                    {r.note && <div style={{ fontSize: 12, color: '#5A5A80' }}>{r.note}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: '#5A5A80', fontFamily: 'JetBrains Mono, monospace' }}>{r.date}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: proj?.color || '#C8F135' }}>{cur}{r.amount}</div>
                  <button className="btn-ghost" style={{ padding: '5px 8px' }} onClick={() => deleteEntry(r.id)}><X size={13} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
