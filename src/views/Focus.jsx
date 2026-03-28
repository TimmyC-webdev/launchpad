import { useState } from 'react';
import { Plus, X, CheckCircle2, Circle } from 'lucide-react';

export default function Focus({ data, update }) {
  const { weeklyFocus, projects } = data;
  const [form, setForm] = useState({ text: '', projectId: projects[0]?.id || '' });

  const addTask = () => {
    if (!form.text.trim()) return;
    const task = { id: Date.now().toString(), text: form.text, done: false, projectId: form.projectId };
    update({ ...data, weeklyFocus: [...weeklyFocus, task] });
    setForm(f => ({ ...f, text: '' }));
  };

  const toggleTask = (id) => {
    update({ ...data, weeklyFocus: weeklyFocus.map(t => t.id === id ? { ...t, done: !t.done } : t) });
  };

  const deleteTask = (id) => {
    update({ ...data, weeklyFocus: weeklyFocus.filter(t => t.id !== id) });
  };

  const done = weeklyFocus.filter(t => t.done).length;
  const pct = weeklyFocus.length ? Math.round(done / weeklyFocus.length * 100) : 0;

  const grouped = projects.map(p => ({
    ...p,
    tasks: weeklyFocus.filter(t => t.projectId === p.id),
  })).filter(p => p.tasks.length > 0);

  const ungrouped = weeklyFocus.filter(t => !projects.find(p => p.id === t.projectId));

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="section-title" style={{ marginBottom: 4 }}>This Week</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, margin: 0 }}>Weekly Focus</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: '#C8F135', lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 13, color: '#5A5A80' }}>{done}/{weeklyFocus.length} done</div>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5A5A80', marginBottom: 10 }}>
          <span>Weekly completion</span>
          <span>{done} of {weeklyFocus.length} tasks</span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C8F135, #00F5D4)' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
          {projects.map(p => {
            const ptasks = weeklyFocus.filter(t => t.projectId === p.id);
            if (!ptasks.length) return null;
            const pdone = ptasks.filter(t => t.done).length;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#6060A0' }}>
                <span>{p.emoji}</span>
                <span>{p.name}</span>
                <span className="tag" style={{ background: p.color + '20', color: p.color }}>{pdone}/{ptasks.length}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add task */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Add task</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: 10 }}>
          <input
            placeholder="What needs to get done this week?"
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            style={{ padding: '9px 14px' }}
          />
          <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} style={{ padding: '9px 12px' }}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
          </select>
          <button className="btn-primary" style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 7, fontSize: 14 }} onClick={addTask}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* Grouped tasks */}
      {grouped.map(p => (
        <div key={p.id} className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{p.emoji}</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>{p.name}</span>
            <span className="tag" style={{ background: p.color + '18', color: p.color }}>
              {p.tasks.filter(t => t.done).length}/{p.tasks.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {p.tasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: t.done ? '#12121A' : '#1A1A26', borderRadius: 10, transition: 'all 0.2s' }}>
                <button onClick={() => toggleTask(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: t.done ? '#C8F135' : '#3D3D5C', display: 'flex' }}>
                  {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span style={{ flex: 1, fontSize: 14, color: t.done ? '#4A4A70' : '#E8E8F0', textDecoration: t.done ? 'line-through' : 'none', transition: 'all 0.2s' }}>{t.text}</span>
                <button className="btn-ghost" style={{ padding: '4px 7px' }} onClick={() => deleteTask(t.id)}><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {ungrouped.length > 0 && (
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#6060A0' }}>Uncategorised</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ungrouped.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: '#1A1A26', borderRadius: 10 }}>
                <button onClick={() => toggleTask(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: t.done ? '#C8F135' : '#3D3D5C', display: 'flex' }}>
                  {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span style={{ flex: 1, fontSize: 14, color: t.done ? '#4A4A70' : '#E8E8F0', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                <button className="btn-ghost" style={{ padding: '4px 7px' }} onClick={() => deleteTask(t.id)}><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {weeklyFocus.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#4A4A70' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#6060A0' }}>No tasks yet</div>
          <div style={{ fontSize: 14 }}>Add your focus tasks for the week above</div>
        </div>
      )}
    </div>
  );
}
