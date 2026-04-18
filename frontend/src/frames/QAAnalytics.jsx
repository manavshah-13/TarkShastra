import React from 'react';
import AppLayout from '../components/AppLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { 
  Target, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  RefreshCcw,
  Activity,
  Maximize2
} from 'lucide-react';

const MetricCard = ({ title, value, delta, status }) => (
  <div className="card space-y-4 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <p className="text-tiny text-text-muted font-bold tracking-widest uppercase">{title}</p>
      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${delta > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}%
      </div>
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-black tracking-tight text-text-primary">{value}</h3>
      <div className="w-12 h-1 bg-border-subtle rounded-full overflow-hidden">
         <div className={`h-full ${status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'} w-[85%]`} />
      </div>
    </div>
  </div>
);

const QAAnalytics = ({ onNext }) => {
  const trendData = [
    { name: 'Jan', accuracy: 0.92, drift: 0.02 },
    { name: 'Feb', accuracy: 0.94, drift: 0.015 },
    { name: 'Mar', accuracy: 0.98, drift: 0.01 },
    { name: 'Apr', accuracy: 0.97, drift: 0.012 },
    { name: 'May', accuracy: 0.99, drift: 0.008 },
  ];

  const distributionData = [
    { name: 'Match', value: 85 },
    { name: 'Minor Drift', value: 12 },
    { name: 'Miscalc', value: 3 },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  return (
    <AppLayout activePage="Analytics">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Quality Assurance Intelligence</h1>
            <p className="text-text-secondary">Neural model benchmarking and statistical drift monitoring</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary transition-all shadow-sm">
                <RefreshCcw size={16} />
                Refresh Benchmark
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                Classification Audit
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <MetricCard title="System Accuracy" value="99.2%" delta={4.2} status="optimal" />
           <MetricCard title="Label Consistency" value="0.982" delta={0.5} status="optimal" />
           <MetricCard title="Model Drift" value="0.008" delta={-12} status="optimal" />
           <MetricCard title="Validation Latency" value="142ms" delta={2.1} status="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Accuracy Trend (8 cols) */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="card space-y-6">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                       <Target size={20} className="text-brand-primary" />
                       <h3 className="text-lg font-bold tracking-tight">Neural Accuracy Progression</h3>
                    </div>
                    <div className="flex bg-input-bg p-1 rounded-lg">
                       <button className="px-3 py-1 bg-card-bg text-brand-primary text-[10px] font-bold rounded shadow-sm">Monthly</button>
                       <button className="px-3 py-1 text-text-muted text-[10px] font-bold rounded">Weekly</button>
                    </div>
                 </div>
                 <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} domain={[0.9, 1.0]} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={3} fill="#3B82F6" fillOpacity={0.1} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="card space-y-4">
                    <div className="flex items-center gap-3 text-brand-primary">
                       <Activity size={18} />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Throughput Sync</h3>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">12,400 <span className="text-xs text-text-muted font-medium">Req/Sec</span></p>
                    <div className="h-2 w-full bg-border-subtle rounded-full"><div className="h-full bg-brand-primary w-[75%]" /></div>
                 </div>
                 <div className="card space-y-4 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-3 text-emerald-500">
                       <ShieldCheck size={18} />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Security Integrity</h3>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">SHA-256 <span className="text-xs text-text-muted font-medium">Verified</span></p>
                    <div className="h-2 w-full bg-border-subtle rounded-full"><div className="h-full bg-emerald-500 w-[100%]" /></div>
                 </div>
              </div>
           </div>

           {/* Distribution (4 cols) */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="card flex flex-col items-center">
                 <h3 className="w-full text-center text-sm font-bold tracking-tight uppercase text-text-muted mb-6">Prediction Distribution</h3>
                 <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="pt-6 w-full space-y-3">
                    {distributionData.map((item, i) => (
                      <div key={item.name} className="flex justify-between items-center text-xs">
                         <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                            <span className="font-semibold text-text-secondary">{item.name}</span>
                         </div>
                         <span className="font-bold text-text-primary">{item.value}%</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="card space-y-6 bg-app-bg/50 border-dashed">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold tracking-tight uppercase text-text-muted">Anomaly Log</h3>
                    <AlertCircle size={14} className="text-brand-primary" />
                 </div>
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 p-3 bg-card-bg rounded-xl border border-border-subtle group hover:border-brand-primary transition-all cursor-pointer">
                         <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center shrink-0"><AlertCircle size={18} /></div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">Region Drift: 4.2% [Asia-Pac]</p>
                            <p className="text-[10px] text-text-muted">High latency detected in NN-Layer 4</p>
                         </div>
                         <ChevronRight size={14} className="text-text-muted self-center" />
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-3 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all uppercase tracking-widest">
                    Clear Log Sequence
                 </button>
              </div>
           </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QAAnalytics;
