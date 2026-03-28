import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard({ data, setView }) {
  const { projects, weeklyFocus, settings } = data;
  const cur = settings.currency;

  const totalMRR   = projects.reduce((s, p) => s + p.mrr, 0);
  const totalUsers = projects.reduce((s, p) => s + p.users, 0);
  const active     = projects.filter(p => p.status === 'active').length;
  const focusDone  = weeklyFocus.filter(f => f.done).length;
  const focusPct   = weeklyFocus.length ? Math.round(focusDone / weeklyFocus.length * 100) : 0;

  const weeklyData = useMemo(() => DAYS.map((day, i) => ({
    day,
    revenue: projects.reduce((s, p) => s + (p.weeklyRevenue?.[i] ?? 0), 0),
  })), [projects]);

  const weekTotal = weeklyData.reduce((s, d) => s + d.revenue, 0);

  const stats = [
    { label: 'Monthly Revenue', value: `${cur}${totalMRR.toLocaleString()}`, delta: '+18%', up: true },
    { label: 'Active Users',    value: totalUsers.toLocaleString(),          delta: '+24', up: true },
    { label: 'Active Projects', value: `${active} / ${projects.length}`,     delta: null },
    { label: 'Focus Done',      value: `${focusPct}%`,                       delta: `${focusDone}/${weeklyFocus.length} tasks`, up: true },
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 32, fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--text)', lineHeight: 1.1 }}>
            Good to see you, {settings.name}.
          </h1>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {stats.map(({ label, value, delta, up }) => (
          <div key={label} className="card" style={{ padding: '18px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>{label}</p>
            <p className="stat-number" style={{ color: 'var(--text)', marginBottom: 8 }}>{value}</p>
            {delta && (
              <p style={{ fontSize: 11, color: up ? '#6EE7B7' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                {up && <TrendingUp size={10} />} {delta}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 5 }}>This Week</p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 20, fontWeight: 400, letterSpacing: '-0.01em' }}>Revenue trend</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>Total</p>
            <p style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', color: '#6EE7B7' }}>{cur}{weekTotal}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={weeklyData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#6EE7B7" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6EE7B7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#4A4A58', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#18181C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12, color: '#F0F0F4' }}
              formatter={v => [`${cur}${v}`, 'Revenue']}
              cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6EE7B7" strokeWidth={1.5} fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: '#6EE7B7', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Projects list */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Portfolio</p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 20, fontWeight: 400 }}>Active projects</p>
          </div>
          <button className="btn-ghost" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }} onClick={() => setView('projects')}>
            View all <ArrowUpRight size={12} />
          </button>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {projects.filter(p => p.status === 'active').map((p, i, arr) => {
            const pct = Math.min(100, Math.round((p.revenue / p.goal) * 100));
            return (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 180px 90px 90px',
                alignItems: 'center', gap: 16,
                padding: '14px 22px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: p.color + '15', border: `1px solid ${p.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{p.emoji}</div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 13, letterSpacing: '-0.01em', marginBottom: 3 }}>{p.name}</p>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span className="tag" style={{ background: p.color + '15', color: p.color }}>{p.stage}</span>
                      {p.stack.slice(0, 1).map(s => <span key={s} className="tag" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{s}</span>)}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
                    <span>Goal</span><span>{cur}{p.revenue} / {cur}{p.goal}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>MRR</p>
                  <p style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', color: p.color }}>{cur}{p.mrr}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>Users</p>
                  <p style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em' }}>{p.users}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
