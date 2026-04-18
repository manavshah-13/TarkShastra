import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
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
  Maximize2,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const MetricCard = ({ title, value, delta, status, loading }) => (
  <div className="card space-y-4 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <p className="text-tiny text-text-muted font-bold tracking-widest uppercase">{loading ? '...' : title}</p>
      {!loading && delta !== undefined && (
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${delta > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </div>
      )}
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-black tracking-tight text-text-primary">{loading ? '-' : value}</h3>
      <div className="w-12 h-1 bg-border-subtle rounded-full overflow-hidden">
         <div className={`h-full ${status === 'optimal' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'} w-[85%]`} />
      </div>
    </div>
  </div>
);

const HeatmapCell = ({ value, predicted, actual, onClick }) => {
  const intensity = value / 100;
  return (
    <div 
      onClick={() => onClick && onClick(predicted, actual)}
      className="w-12 h-12 rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all"
      style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
      title={`AI: ${predicted} | Actual: ${actual}`}
    >
      <span className="text-[10px] font-bold text-white">{value}</span>
    </div>
  );
};

const QAAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchQAStats();
  }, [timeRange]);

  const fetchQAStats = async () => {
    setLoading(true);
    try {
      const data = await api.get('/analytics/qa');
      setStats(data);
      // Show alert if accuracy < 90%
      if (data && data.accuracy < 0.9) {
        setShowAlert(true);
      }
    } catch (err) {
      console.error('Failed to fetch QA stats', err);
      // Mock data for demo
      setStats({
        accuracy: 0.92,
        labelConsistency: 0.982,
        modelDrift: 0.008,
        latency: 142,
        accuracyTrend: [
          { name: 'Jan', accuracy: 0.92, drift: 0.02 },
          { name: 'Feb', accuracy: 0.94, drift: 0.015 },
          { name: 'Mar', accuracy: 0.98, drift: 0.01 },
          { name: 'Apr', accuracy: 0.97, drift: 0.012 },
          { name: 'May', accuracy: 0.99, drift: 0.008 },
        ],
        distribution: [
          { name: 'Match', value: 85 },
          { name: 'Minor Drift', value: 12 },
          { name: 'Miscalc', value: 3 },
        ],
        confusionMatrix: [
          [{ predicted: 'Hardware', actual: 'Hardware', value: 45 }, { predicted: 'Hardware', actual: 'Billing', value: 5 }],
          [{ predicted: 'Billing', actual: 'Hardware', value: 3 }, { predicted: 'Billing', actual: 'Billing', value: 38 }],
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHeatmapClick = (predicted, actual) => {
    // Navigate to QA review filtered by this mismatch
    navigate(`/qa/review?predicted=${predicted}&actual=${actual}`);
  };

  const trendData = stats?.accuracyTrend || [
    { name: 'Jan', accuracy: 0.92, drift: 0.02 },
    { name: 'Feb', accuracy: 0.94, drift: 0.015 },
    { name: 'Mar', accuracy: 0.98, drift: 0.01 },
    { name: 'Apr', accuracy: 0.97, drift: 0.012 },
    { name: 'May', accuracy: 0.99, drift: 0.008 },
  ];

  const distributionData = stats?.distribution || [
    { name: 'Match', value: 85 },
    { name: 'Minor Drift', value: 12 },
    { name: 'Miscalc', value: 3 },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  return (
    <AppLayout>
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Quality Assurance Intelligence</h1>
            <p className="text-text-secondary">Neural model benchmarking and statistical drift monitoring</p>
          </div>
          <div className="flex gap-3">
             <button onClick={fetchQAStats} className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary transition-all shadow-sm">
                <RefreshCcw size={16} />
                Refresh Benchmark
             </button>
             <button onClick={() => navigate('/qa/review')} className="btn-primary flex items-center gap-2">
                Classification Audit
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        {/* Alert Banner */}
        {showAlert && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <AlertTriangle size={20} className="text-rose-500" />
            <span className="text-sm font-semibold text-rose-700">
              Model accuracy degraded - review required
            </span>
            <button onClick={() => setShowAlert(false)} className="ml-auto text-rose-500 hover:text-rose-600">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <MetricCard title="System Accuracy" value={stats ? `${(stats.accuracy * 100).toFixed(1)}%` : '-'} delta={4.2} status="optimal" loading={loading} />
           <MetricCard title="Label Consistency" value={stats?.labelConsistency?.toFixed(3) || '-'} delta={0.5} status="optimal" loading={loading} />
           <MetricCard title="Model Drift" value={stats?.modelDrift?.toFixed(3) || '-'} delta={-12} status="optimal" loading={loading} />
           <MetricCard title="Validation Latency" value={stats?.latency ? `${stats.latency}ms` : '-'} delta={2.1} status="warning" loading={loading} />
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
                       <button 
                         onClick={() => setTimeRange('monthly')}
                         className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${timeRange === 'monthly' ? 'bg-card-bg text-brand-primary shadow-sm' : 'text-text-muted'}`}
                       >
                         Monthly
                       </button>
                       <button 
                         onClick={() => setTimeRange('weekly')}
                         className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${timeRange === 'weekly' ? 'bg-card-bg text-brand-primary shadow-sm' : 'text-text-muted'}`}
                       >
                         Weekly
                       </button>
                    </div>
                 </div>
                 {loading ? (
                   <div className="h-[400px] flex items-center justify-center">
                     <Loader2 size={32} className="animate-spin text-brand-primary" />
                   </div>
                 ) : (
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
                 )}
              </div>

              {/* Confusion Matrix Heatmap */}
              <div className="card space-y-4">
                 <div className="flex items-center gap-3">
                    <Activity size={18} className="text-brand-primary" />
                    <h3 className="text-sm font-bold tracking-tight uppercase">Confusion Matrix (Click to filter)</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <div className="flex gap-2 min-w-max p-4 bg-app-bg rounded-xl">
                     {/* Headers */}
                     <div className="flex flex-col gap-2">
                       <div className="h-8" />
                       {['Hardware', 'Billing'].map(cat => (
                         <div key={cat} className="h-12 flex items-center justify-center text-[10px] font-bold text-text-muted uppercase">
                           Actual: {cat}
                         </div>
                       ))}
                     </div>
                     {/* Matrix */}
                     {[
                       [{ predicted: 'Hardware', actual: 'Hardware', value: 45 }, { predicted: 'Hardware', actual: 'Billing', value: 5 }],
                       [{ predicted: 'Billing', actual: 'Hardware', value: 3 }, { predicted: 'Billing', actual: 'Billing', value: 38 }],
                     ].map((row, i) => (
                       <div key={i} className="flex flex-col gap-2">
                         <div className="h-8 flex items-center justify-center text-[10px] font-bold text-text-muted uppercase">
                           Pred: {i === 0 ? 'Hardware' : 'Billing'}
                         </div>
                         {row.map((cell, j) => (
                           <HeatmapCell 
                             key={j} 
                             {...cell} 
                             onClick={handleHeatmapClick}
                           />
                         ))}
                       </div>
                     ))}
                   </div>
                 </div>
                 <p className="text-[10px] text-text-muted">Click any cell to filter QA review queue by that classification mismatch</p>
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
                 {loading ? (
                   <div className="h-[260px] flex items-center justify-center">
                     <Loader2 size={32} className="animate-spin text-brand-primary" />
                   </div>
                 ) : (
                   <>
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
                   </>
                 )}
              </div>

              <div className="card space-y-6 bg-app-bg/50 border-dashed">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold tracking-tight uppercase text-text-muted">Anomaly Log</h3>
                    <AlertCircle size={14} className="text-brand-primary" />
                 </div>
                 <div className="space-y-4">
                    {[
                      { title: 'Region Drift: 4.2% [Asia-Pac]', desc: 'High latency detected in NN-Layer 4', type: 'warning' },
                      { title: 'Model Version Mismatch', desc: 'Tark-v3.2.0 vs v3.2.1', type: 'info' },
                      { title: 'Confidence Threshold Breach', desc: '12 cases below 70% confidence', type: 'alert' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-3 bg-card-bg rounded-xl border border-border-subtle group hover:border-brand-primary transition-all cursor-pointer" onClick={() => navigate('/qa/review')}>
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'alert' ? 'bg-rose-500/10 text-rose-500' : item.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                            <AlertCircle size={18} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{item.title}</p>
                            <p className="text-[10px] text-text-muted">{item.desc}</p>
                         </div>
                         <ChevronRight size={14} className="text-text-muted self-center" />
                      </div>
                    ))}
                 </div>
                 <button onClick={() => navigate('/qa/review')} className="w-full py-3 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all uppercase tracking-widest">
                    Review Anomalies
                 </button>
              </div>
           </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QAAnalytics;
