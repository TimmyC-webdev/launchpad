const STORAGE_KEY = 'indie-dash-v2';

const defaultData = {
  projects: [
    {
      id: '1', name: 'Formly', emoji: '📋',
      status: 'active', stage: 'scaling',
      revenue: 3840, goal: 5000, mrr: 960,
      users: 312, tasks: 10, completedTasks: 8,
      stack: ['Next.js', 'Postgres', 'Stripe'],
      color: '#6EE7B7',
      weeklyRevenue: [180, 200, 220, 210, 240, 260, 280],
      notes: 'No-code form builder with logic branching and analytics. Freemium with pro plan at £12/mo.',
      createdAt: '2025-06-01',
    },
    {
      id: '2', name: 'Beacon', emoji: '🔦',
      status: 'active', stage: 'beta',
      revenue: 540, goal: 3000, mrr: 180,
      users: 58, tasks: 14, completedTasks: 9,
      stack: ['React', 'Supabase', 'Tailwind'],
      color: '#A78BFA',
      weeklyRevenue: [0, 20, 40, 60, 100, 140, 180],
      notes: 'Status page tool for indie devs. Shows uptime, incidents and lets users subscribe to alerts.',
      createdAt: '2025-11-10',
    },
    {
      id: '3', name: 'Helio', emoji: '☀️',
      status: 'active', stage: 'building',
      revenue: 0, goal: 2000, mrr: 0,
      users: 0, tasks: 18, completedTasks: 6,
      stack: ['Swift', 'Python', 'FastAPI'],
      color: '#FCD34D',
      weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
      notes: 'iOS weather app with AI-generated outfit suggestions. Currently in private beta.',
      createdAt: '2026-01-20',
    },
    {
      id: '4', name: 'Inkdrop', emoji: '🖊️',
      status: 'paused', stage: 'idea',
      revenue: 0, goal: 1500, mrr: 0,
      users: 0, tasks: 4, completedTasks: 0,
      stack: ['React Native', 'SQLite'],
      color: '#F9A8D4',
      weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
      notes: 'Minimal journaling app with mood tracking. Parked while Helio is in progress.',
      createdAt: '2026-02-01',
    },
  ],
  weeklyFocus: [
    { id: 'f1', text: 'Ship annual billing for Formly pro plan', done: true, projectId: '1' },
    { id: 'f2', text: 'Fix email notification delay on Beacon', done: true, projectId: '2' },
    { id: 'f3', text: 'Design onboarding flow for Helio', done: false, projectId: '3' },
    { id: 'f4', text: 'Write landing page copy for Helio', done: false, projectId: '3' },
    { id: 'f5', text: 'Respond to Formly support queue', done: true, projectId: '1' },
    { id: 'f6', text: 'Set up Beacon public roadmap page', done: false, projectId: '2' },
  ],
  revenueLog: [
    { id: 'r1', projectId: '1', amount: 240, date: '2026-01-01', note: 'Jan subscriptions' },
    { id: 'r2', projectId: '1', amount: 480, date: '2026-02-01', note: 'Feb — grew 2×' },
    { id: 'r3', projectId: '1', amount: 720, date: '2026-03-01', note: 'Mar subscriptions' },
    { id: 'r4', projectId: '1', amount: 960, date: '2026-03-15', note: 'Mid-month top-up' },
    { id: 'r5', projectId: '2', amount: 60,  date: '2026-02-10', note: 'First beta signups' },
    { id: 'r6', projectId: '2', amount: 120, date: '2026-03-01', note: 'Mar beta users' },
    { id: 'r7', projectId: '2', amount: 180, date: '2026-03-18', note: 'New conversions' },
  ],
  settings: {
    name: '',
    currency: '£',
    weekStart: 'Mon',
  },
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData;
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportCSV(data) {
  const rows = [
    ['Project', 'Status', 'Stage', 'MRR', 'Total Revenue', 'Users', 'Tasks Done', 'Stack', 'Created'],
    ...data.projects.map(p => [
      p.name, p.status, p.stage, p.mrr, p.revenue, p.users,
      `${p.completedTasks}/${p.tasks}`, p.stack.join(' | '), p.createdAt,
    ])
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  download(csv, 'indiedash-export.csv', 'text/csv');
}

export function exportJSON(data) {
  download(JSON.stringify(data, null, 2), 'indiedash-export.json', 'application/json');
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export const STAGES = ['idea', 'building', 'beta', 'launch', 'scaling'];
export const STATUSES = ['active', 'paused', 'archived'];
export const COLORS = ['#6EE7B7', '#A78BFA', '#FCD34D', '#F9A8D4', '#67E8F9', '#FCA5A5'];
