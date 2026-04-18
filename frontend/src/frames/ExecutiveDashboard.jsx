import React from 'react';
import AppLayout from '../components/AppLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

const KPICard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="card space-y-4">
    <div className="flex justify-between items-start">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend > 0 ? '+' : ''}{trend}%
        <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
      </div>
    </div>
    <div>
      <p className="text-tiny mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-text-primary tracking-tight">{value}</h3>
    </div>
  </div>
);

const ExecutiveDashboard = ({ onNext }) => {
  const data = [
    { name: 'Mon', active: 400, resolved: 240 },
    { name: 'Tue', active: 300, resolved: 139 },
    { name: 'Wed', active: 200, resolved: 980 },
    { name: 'Thu', active: 278, resolved: 390 },
    { name: 'Fri', active: 189, resolved: 480 },
    { name: 'Sat', active: 239, resolved: 380 },
    { name: 'Sun', active: 349, resolved: 430 },
  ];

  const complaints = [
    { id: 'CMP-821', user: 'Velocity Corp', status: 'Priority P0', time: '12m ago', score: 0.94 },
    { id: 'CMP-744', user: 'Nexus Systems', status: 'Escalated', time: '45m ago', score: 0.88 },
    { id: 'CMP-902', user: 'Orbital Dynamics', status: 'Pending', time: '1h ago', score: 0.72 },
  ];

  return (
    <AppLayout activePage="Dashboard">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Executive Pulse</h1>
            <p className="text-text-secondary">Network-wide sentiment & operational throughput</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary transition-all shadow-sm">
                <Filter size={16} />
                Layered Filters
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                <Download size={16} />
                Snapshot PDF
             </button>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="ACTIVE COMPLAINTS" value="1,422" trend={12} icon={AlertTriangle} color="bg-amber-500" />
          <KPICard title="MEAN RESOLUTION TIME" value="14.2h" trend={-8} icon={Clock} color="bg-brand-primary" />
          <KPICard title="TEAM THROUGHPUT" value="94.8%" trend={3} icon={Users} color="bg-emerald-500" />
          <KPICard title="NEURAL ACCURACY" value="0.99" trend={0.2} icon={ShieldCheck} color="bg-violet-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-8 space-y-6">
             <div className="card space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-bold tracking-tight">Throughput Analysis</h3>
                   <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-2 py-1"><div className="w-2.5 h-2.5 rounded-full bg-brand-primary" /><span className="text-[10px] font-bold text-text-muted uppercase">Ingested</span></div>
                      <div className="flex items-center gap-2 px-2 py-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-text-muted uppercase">Resolved</span></div>
                   </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                      <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Side Component: Real-time Feed */}
          <div className="lg:col-span-4 space-y-6">
             <div className="card space-y-6 bg-app-bg/50 border-dashed">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Critical Queue</h3>
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                
                <div className="space-y-4">
                   {complaints.map((c) => (
                     <div key={c.id} className="p-4 bg-card-bg rounded-xl border border-border-subtle shadow-sm hover:border-brand-primary transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <p className="text-xs font-bold text-text-primary">{c.id} : {c.user}</p>
                              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest pt-1">{c.status}</p>
                           </div>
                           <span className="text-[10px] text-text-muted font-mono">{c.time}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                           <div className="flex gap-2">
                              {['Safety', 'Hardware'].map(tag => (
                                <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-app-bg rounded border border-border-subtle text-text-muted uppercase">{tag}</span>
                              ))}
                           </div>
                           <ChevronRight size={14} className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                   ))}
                </div>
                
                <button className="w-full py-3 bg-card-bg border border-border-subtle rounded-xl text-xs font-bold text-text-secondary hover:text-brand-primary transition-all uppercase tracking-widest">
                   Access Full Ledger
                </button>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ExecutiveDashboard;
