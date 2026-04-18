import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle, 
  Activity, 
  ChevronRight, 
  Zap, 
  ShieldAlert, 
  RefreshCcw,
  Volume2,
  VolumeX,
  History,
  CornerUpRight,
  TrendingUp,
  Maximize2
} from 'lucide-react';

const Countdown = ({ initialSeconds, label, type }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  const isCritical = seconds < 600;

  return (
    <div className={`card p-8 flex flex-col items-center justify-center space-y-4 relative overflow-hidden transition-all duration-300 ${isCritical ? 'bg-rose-500/5 border-rose-500/30 shadow-2xl shadow-rose-500/10' : ''}`}>
      <p className="text-[10px] font-black tracking-[0.2em] text-text-muted uppercase">{label}</p>
      <div className={`text-5xl font-mono font-black tracking-tighter ${isCritical ? 'text-rose-600 animate-pulse' : 'text-text-primary'}`}>
        {hrs}:{mins}:{secs}
      </div>
      <div className="flex gap-3">
         <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${type === 'P0' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'}`}>
           {type}
         </span>
         <span className="px-3 py-1 rounded-lg bg-app-bg text-[10px] font-bold border border-border-subtle font-mono text-text-muted">
           CMP-892
         </span>
      </div>
      {isCritical && (
         <div className="absolute top-4 right-4 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <div className="w-2 h-2 rounded-full bg-rose-500" />
         </div>
      )}
    </div>
  );
};

const SLAMonitor = ({ onNext }) => {
  const [muted, setMuted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 800);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const riskData = [
    { label: 'Hardware', p0: 12, p1: 45, p2: 128 },
    { label: 'Billing', p0: 2, p1: 18, p2: 240 },
    { label: 'Safety', p0: 4, p1: 8, p2: 12 },
    { label: 'Security', p0: 1, p1: 5, p2: 4 },
  ];

  return (
    <AppLayout activePage="Monitoring">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        
        {/* Critical Banner */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-rose-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-2xl relative overflow-hidden group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-rose-500/50 to-transparent pointer-events-none" />
           <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-inner border border-white/20">
                <ShieldAlert size={28} className="animate-bounce" />
              </div>
              <div>
                 <p className="font-black text-lg tracking-tight uppercase">CRITICAL SYSTEM BREACH: 14 CASES OVERDUE</p>
                 <p className="text-xs font-semibold opacity-90 tracking-wide">Hardware-P0 tier is currently operating at 400% latency against established SLA core agreements.</p>
              </div>
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="flex -space-x-3">
                 {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-rose-600 bg-slate-200" />)}
              </div>
              <button className="bg-white text-rose-600 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-900/20">
                 VIEW BREACHES
              </button>
           </div>
        </motion.div>

        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-tiny text-text-muted">TarkShastra Sentinel Control</p>
            <div className="flex items-center gap-6">
               <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Service Level Oversight</h1>
               <div className="flex items-center gap-2 text-[10px] font-mono font-black text-text-muted bg-input-bg px-3 py-1 rounded-full border border-border-subtle">
                 <RefreshCcw size={12} className={refreshing ? 'animate-spin' : ''} />
                 SLA_SYNC: 30s
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setMuted(!muted)} className="p-3 bg-card-bg border border-border-subtle rounded-xl text-text-muted hover:bg-app-bg hover:text-brand-primary transition-all shadow-sm">
               {muted ? <VolumeX size={20} /> : <Volume2 size={20} className="text-brand-primary" />}
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                <TrendingUp size={18} />
                Generate Audit
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Countdown Area (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
             <Countdown initialSeconds={450} label="NEAREST P0 DEADLINE" type="P0" />
             <Countdown initialSeconds={3620} label="NEXT HARDWARE ESCALATION" type="P1" />
             <Countdown initialSeconds={12400} label="BILLING AUDIT GATE" type="P2" />
          </div>

          {/* Risk Heatmap (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
             <div className="card space-y-8">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Activity size={20} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Operational Risk Heatmap</h3>
                   </div>
                   <div className="flex gap-6">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-600 rounded-sm shadow-[0_0_5px_var(--danger)]" /><span className="text-[10px] font-black text-text-muted uppercase">CRITICAL</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-sm shadow-[0_0_5px_var(--warning)]" /><span className="text-[10px] font-black text-text-muted uppercase">WARNING</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-[0_0_5px_var(--success)]" /><span className="text-[10px] font-black text-text-muted uppercase">STABLE</span></div>
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-center">
                      <thead>
                         <tr className="bg-app-bg/50">
                            <th className="p-4 text-left text-tiny">ANOMALY CATEGORY</th>
                            <th className="p-4 text-tiny">PRIORITY P0</th>
                            <th className="p-4 text-tiny">PRIORITY P1</th>
                            <th className="p-4 text-tiny">PRIORITY P2</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                         {riskData.map(row => (
                           <tr key={row.label} className="group hover:bg-app-bg/30 transition-colors">
                              <td className="p-4 text-left">
                                 <span className="text-sm font-black text-text-primary tracking-tight">{row.label.toUpperCase()}</span>
                                 <p className="text-[10px] text-text-muted font-bold tracking-widest pt-1">NODE_ID_82X</p>
                              </td>
                              <td className="p-4">
                                 <div className={`h-14 flex items-center justify-center rounded-xl font-black text-lg transition-all border border-transparent ${row.p0 > 10 ? 'bg-rose-600 text-white shadow-lg border-rose-500 shadow-rose-500/10 scale-105' : row.p0 > 5 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                    {row.p0}
                                 </div>
                              </td>
                              <td className="p-4">
                                 <div className={`h-14 flex items-center justify-center rounded-xl font-black text-lg transition-all ${row.p1 > 40 ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/10' : row.p1 > 20 ? 'bg-amber-500 text-white shadow-inner' : 'bg-slate-100 dark:bg-slate-800 text-text-primary border border-border-subtle'}`}>
                                    {row.p1}
                                 </div>
                              </td>
                              <td className="p-4">
                                 <div className="h-14 flex items-center justify-center rounded-xl font-mono text-lg bg-card-bg border border-border-subtle text-text-muted">
                                    {row.p2}
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card space-y-6">
                   <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/30">
                      <Zap size={18} className="text-amber-500" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Queue Depth Index</h3>
                   </div>
                   <div className="space-y-6 pt-4 text-text-primary">
                      {['P0 Tier Backlog', 'P1 Operational Load', 'Global Escalations'].map((t, i) => (
                        <div key={t} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span>{t}</span>
                              <span className={i === 0 ? 'text-rose-600' : 'text-text-muted'}>{85 - i*20}% Pressure</span>
                           </div>
                           <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-subtle p-0.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${85 - i*20}%` }}
                                className={`h-full rounded-full ${i === 0 ? 'bg-rose-600 shadow-[0_0_10px_var(--danger)]' : 'bg-brand-primary shadow-[0_0_10px_var(--primary)]'}`}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="card space-y-6">
                   <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/30 text-text-primary">
                      <History size={18} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Action Shortcuts</h3>
                   </div>
                   <div className="space-y-3 pt-6">
                      <button className="w-full p-4 bg-app-bg border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest text-left flex items-center justify-between group hover:border-brand-primary hover:bg-brand-subtle transition-all">
                         <span className="flex items-center gap-3"><Clock size={14} className="text-brand-primary" /> EXTEND NEAREST SLA</span>
                         <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="w-full p-4 bg-app-bg border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left flex items-center justify-between group hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                         <span className="flex items-center gap-3"><ShieldAlert size={14} className="group-hover:scale-110 transition-transform" /> BULK ESCALATE P0</span>
                         <Zap size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button className="w-full p-4 bg-app-bg border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest text-left flex items-center justify-between group hover:border-brand-primary hover:bg-brand-subtle transition-all">
                         <span className="flex items-center gap-3"><CornerUpRight size={14} /> NOTIFY TEAM ARCHITECT</span>
                         <Maximize2 size={12} className="opacity-40" />
                      </button>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default SLAMonitor;
