import { useState } from 'react';
import { Plus, X, Edit2, Users, DollarSign, CheckSquare } from 'lucide-react';
import { STAGES, STATUSES, COLORS } from '../store';

const defaultForm = {
  name: '', emoji: '🚀', status: 'active', stage: 'idea',
  revenue: 0, goal: 1000, mrr: 0, users: 0, tasks: 0,
  completedTasks: 0, stack: '', color: '#C8F135', notes: '',
  weeklyRevenue: [0,0,0,0,0,0,0], createdAt: new Date().toISOString().slice(0,10),
};

function Modal({ project, onSave, onClose, currency }) {
  const [form, setForm] = useState(project ? {
    ...project, stack: project.stack.join(', ')
  } : defaultForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      id: project?.id || Date.now().toString(),
      revenue: Number(form.revenue),
      goal: Number(form.goal),
      mrr: Number(form.mrr),
      users: Number(form.users),
      tasks: Number(form.tasks),
      completedTasks: Number(form.completedTasks),
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 540, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, margin: 0 }}>
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px 10px' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 10 }}>
            <input value={form.emoji} onChange={e => set('emoji', e.target.value)} style={{ padding: '10px', textAlign: 'center', fontSize: 22 }} />
            <input placeholder="Project name *" value={form.name} onChange={e => set('name', e.target.value)} style={{ padding: '10px 14px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={{ width: '100%', padding: '9px 12px' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Stage</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)} style={{ width: '100%', padding: '9px 12px' }}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[['Revenue', 'revenue', currency], ['Goal', 'goal', currency], ['MRR', 'mrr', currency]].map(([label, key, prefix]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>{label} ({prefix})</label>
                <input type="number" value={form[key]} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[['Users', 'users'], ['Tasks', 'tasks'], ['Done', 'completedTasks']].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>{label}</label>
                <input type="number" value={form[key]} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px' }} />
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Tech stack (comma-separated)</label>
            <input placeholder="React, Supabase, Tailwind" value={form.stack} onChange={e => set('stack', e.target.value)} style={{ width: '100%', padding: '9px 12px' }} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 8 }}>Accent colour</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => set('color', c)} style={{ width: 26, height: 26, borderRadius: 8, background: c, cursor: 'pointer', border: form.color === c ? '2px solid #fff' : '2px solid transparent', transition: 'transform 0.1s' }} />
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#5A5A80', display: 'block', marginBottom: 5 }}>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', resize: 'vertical' }} />
          </div>

          <button className="btn-primary" style={{ padding: '12px', fontSize: 15 }} onClick={handleSave}>
            {project ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ data, update }) {
  const [modal, setModal] = useState(null); // null | 'new' | project obj
  const [filter, setFilter] = useState('all');
  const { settings } = data;
  const cur = settings.currency;

  const filtered = data.projects.filter(p => filter === 'all' || p.status === filter);

  const saveProject = (proj) => {
    const exists = data.projects.find(p => p.id === proj.id);
    const projects = exists
      ? data.projects.map(p => p.id === proj.id ? proj : p)
      : [...data.projects, proj];
    update({ ...data, projects });
  };

  const deleteProject = (id) => {
    if (!confirm('Delete this project?')) return;
    update({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {modal && (
        <Modal
          project={modal === 'new' ? null : modal}
          onSave={saveProject}
          onClose={() => setModal(null)}
          currency={cur}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="section-title" style={{ marginBottom: 4 }}>All Work</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, margin: 0 }}>Projects</h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', background: '#12121A', border: '1px solid #222232', borderRadius: 10, padding: 3, gap: 2 }}>
            {['all', ...STATUSES].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: filter === f ? '#2E2E45' : 'transparent', color: filter === f ? '#C8F135' : '#6060A0', transition: 'all 0.15s' }}>{f}</button>
            ))}
          </div>
          <button className="btn-primary" style={{ padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 7, fontSize: 14 }} onClick={() => setModal('new')}>
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map(p => {
          const pct = Math.min(100, Math.round((p.revenue / p.goal) * 100));
          return (
            <div key={p.id} className="card card-hover" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.emoji}</div>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: 5, marginTop: 3 }}>
                      <span className="tag" style={{ background: p.color + '22', color: p.color }}>{p.stage}</span>
                      <span className="tag" style={{ background: '#1A1A26', color: '#6060A0' }}>{p.status}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-ghost" style={{ padding: '6px 8px' }} onClick={() => setModal(p)}><Edit2 size={13} /></button>
                  <button className="btn-ghost" style={{ padding: '6px 8px' }} onClick={() => deleteProject(p.id)}><X size={13} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { icon: DollarSign, label: 'MRR', value: `${cur}${p.mrr}`, color: p.color },
                  { icon: Users, label: 'Users', value: p.users, color: '#7B61FF' },
                  { icon: CheckSquare, label: 'Tasks', value: `${p.completedTasks}/${p.tasks}`, color: '#00F5D4' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{ background: '#1A1A26', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                      <Icon size={12} color={color} />
                      <span style={{ fontSize: 11, color: '#5A5A80' }}>{label}</span>
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5A5A80', marginBottom: 6 }}>
                  <span>Revenue goal</span>
                  <span>{cur}{p.revenue} / {cur}{p.goal}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </div>

              {p.stack.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                  {p.stack.map(s => <span key={s} className="tag" style={{ background: '#1A1A26', color: '#7070A0' }}>{s}</span>)}
                </div>
              )}

              {p.notes && <p style={{ fontSize: 13, color: '#5A5A80', margin: 0, lineHeight: 1.5, borderTop: '1px solid #1A1A26', paddingTop: 12 }}>{p.notes}</p>}
            </div>
          );
        })}

        {/* Empty add card */}
        <div className="card" style={{ padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px dashed #2E2E45', minHeight: 180 }} onClick={() => setModal('new')}>
          <div style={{ textAlign: 'center', color: '#4A4A70' }}>
            <Plus size={24} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 500 }}>Add project</div>
          </div>
        </div>
      </div>
    </div>
  );
}
