import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
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
  Maximize2,
  Loader2,
  Calendar,
  MoreVertical,
  CheckSquare,
  Square,
  ArrowUpRight
} from 'lucide-react';

const ContextMenu = ({ x, y, options, onClose }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div 
      className="fixed z-[100] bg-card-bg border border-border-subtle rounded-xl shadow-2xl overflow-hidden py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={opt.onClick}
          className="w-full text-left px-4 py-2 hover:bg-app-bg text-xs font-bold text-text-primary flex items-center justify-between group transition-colors"
        >
          {opt.label}
          {opt.icon && <opt.icon size={14} className="text-text-muted group-hover:text-brand-primary" />}
        </button>
      ))}
    </div>
  );
};

const CountdownTile = ({ complaint, onClick, onAction, isSelected, onSelect }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00', isBreached: false });
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const update = () => {
      const created = new Date(complaint.created_at);
      const deadline = new Date(created.getTime() + (complaint.priority === 'P0' ? 4 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00', isBreached: true });
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0'),
        isBreached: false
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [complaint]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onClick={() => onClick && onClick(complaint)}
        className={`card p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden transition-all duration-300 cursor-pointer group ${
          timeLeft.isBreached ? 'bg-rose-500/5 border-rose-500/20 shadow-rose-500/10' : 
          isSelected ? 'ring-2 ring-brand-primary bg-brand-primary/5' : 'hover:border-brand-primary/30'
        }`}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(!isSelected); }}
          className="absolute top-4 left-4 text-text-muted hover:text-brand-primary transition-colors"
        >
          {isSelected ? <CheckSquare size={16} className="text-brand-primary" /> : <Square size={16} />}
        </button>

        <p className="text-[10px] font-black tracking-widest text-text-muted uppercase line-clamp-1 w-full text-center px-4">{complaint.title}</p>
        
        <div className="flex items-baseline gap-1">
           <div className={`text-4xl font-mono font-black tracking-tighter ${timeLeft.isBreached ? 'text-rose-600 animate-pulse' : 'text-text-primary'}`}>
             {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
           </div>
        </div>

        <div className="flex gap-2 relative z-10">
           <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${
             complaint.priority === 'P0' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
           }`}>
             {complaint.priority}
           </span>
           <span className="px-2 py-0.5 rounded bg-app-bg text-[9px] font-bold border border-border-subtle font-mono text-text-muted">
             ID: {complaint.id}
           </span>
        </div>

        {timeLeft.isBreached && (
          <div className="absolute inset-0 bg-rose-500/10 pointer-events-none" />
        )}
      </div>

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)}
          options={[
            { label: 'Extend SLA', icon: Clock, onClick: () => onAction('extend', complaint.id) },
            { label: 'Reassign Agent', icon: CornerUpRight, onClick: () => onAction('reassign', complaint.id) },
            { label: 'Escalate Priority', icon: Zap, onClick: () => onAction('escalate', complaint.id) },
            { label: 'View Case Trace', icon: Maximize2, onClick: () => onClick(complaint) }
          ]}
        />
      )}
    </>
  );
};

const Heatmap = () => {
  // Simple custom heatmap grid
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    breaches: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0
  }));

  return (
    <div className="card space-y-6">
       <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Calendar size={18} className="text-brand-primary" />
             <h3 className="text-sm font-bold tracking-tight uppercase">Operational Hygiene Trace</h3>
          </div>
          <div className="flex gap-2">
             {[0, 1, 2, 3].map(v => (
               <div key={v} className={`w-3 h-3 rounded-sm ${v === 0 ? 'bg-app-bg border border-border-subtle' : v === 1 ? 'bg-rose-500/20' : v === 2 ? 'bg-rose-500/50' : 'bg-rose-500 shadow-[0_0_5px_var(--danger)]'}`} />
             ))}
          </div>
       </div>
       <div className="grid grid-cols-10 gap-2">
          {days.map(d => (
            <div 
              key={d.day} 
              className={`aspect-square rounded shadow-sm transition-transform hover:scale-110 cursor-help ${
                d.breaches === 0 ? 'bg-app-bg border border-border-subtle' :
                d.breaches < 2 ? 'bg-rose-500/20 border border-rose-500/10' :
                d.breaches < 4 ? 'bg-rose-500/50' :
                'bg-rose-500 shadow-lg shadow-rose-500/20'
              }`}
              title={`Day ${d.day}: ${d.breaches} breaches`}
            />
          ))}
       </div>
    </div>
  );
};

const SLAMonitor = () => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [criticalItems, setCriticalItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSLAData();
    const interval = setInterval(fetchSLAData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSLAData = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/sla/critical').catch(() => ({ complaints: [] }));
      
      const mock = [
        { id: 101, title: 'Mainframe Cooling Failure', priority: 'P0', created_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString() },
        { id: 104, title: 'Encrypted Ledger Desync', priority: 'P0', created_at: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString() },
        { id: 108, title: 'Regional Node TS-8 Offline', priority: 'P1', created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
        { id: 112, title: 'Unauthorized API Burst', priority: 'P0', created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      ];

      setCriticalItems(res.complaints?.length ? res.complaints : mock);
    } catch (err) {
      console.error('SLA fetch error', err);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const handleAction = (type, id) => {
    console.log(`Action ${type} on ${id}`);
    if (type === 'extend') navigate('/justification', { state: { target: id, type: 'SLA' } });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <AppLayout activePage="Monitoring">
      <div className="max-w-[1700px] mx-auto space-y-8 pb-12 text-text-primary">
        
        {/* Critical Banner */}
        <AnimatePresence>
          {criticalItems.filter(c => c.priority === 'P0').length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-rose-600 text-white p-6 rounded-2xl flex items-center justify-between shadow-2xl relative overflow-hidden group mb-8"
            >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/50 to-transparent opacity-50 animate-pulse pointer-events-none" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-inner border border-white/30">
                    <ShieldAlert size={32} className="animate-bounce" />
                  </div>
                  <div>
                     <p className="font-black text-xl tracking-tight uppercase">URGENT: {criticalItems.length} CASES BREACHING SLA</p>
                     <p className="text-sm font-semibold opacity-90">Protocol TS-Sentinel has detected imminent breach window for {criticalItems.filter(c => c.priority === 'P0').length} P0 priority units.</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 relative z-10">
                  <button className="bg-white text-rose-600 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                     ENGAGE CRISIS MODE
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra Sentinel Control</p>
            <div className="flex items-center gap-6">
               <h1 className="text-3xl font-extrabold tracking-tight">SLA Crisis Monitor</h1>
               <div className="flex items-center gap-2 text-[10px] font-mono font-black text-text-muted bg-input-bg px-3 py-1 rounded-full border border-border-subtle">
                 <RefreshCcw size={12} className={refreshing ? 'animate-spin text-brand-primary' : ''} />
                 SLA_SYNC: 30s
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setMuted(!muted)} className="p-3 bg-card-bg border border-border-subtle rounded-xl text-text-muted hover:bg-app-bg hover:text-brand-primary transition-all shadow-sm">
               {muted ? <VolumeX size={20} /> : <Volume2 size={20} className="text-brand-primary" />}
             </button>
             <button onClick={() => navigate('/reports')} className="btn-primary flex items-center gap-2 px-8">
                <TrendingUp size={18} />
                Generate Audit
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Countdown Grid (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                   <Clock size={16} /> 
                   Critical Countdown Matrix
                </h3>
                {selectedIds.length > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
                     <button className="bg-app-bg border border-border-subtle px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:border-brand-primary transition-all">Mass Reassign ({selectedIds.length})</button>
                     <button className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-rose-500/20">Force Escalate</button>
                  </motion.div>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {criticalItems.map(item => (
                  <CountdownTile 
                    key={item.id} 
                    complaint={item} 
                    onClick={(c) => navigate(`/complaints/${c.id}`)}
                    onAction={handleAction}
                    isSelected={selectedIds.includes(item.id)}
                    onSelect={() => toggleSelect(item.id)}
                  />
                ))}
                <button className="card border-dashed border-2 flex flex-col items-center justify-center p-6 text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-subtle/20 transition-all group min-h-[160px]">
                   <Plus size={24} className="group-hover:scale-110 transition-transform" />
                   <p className="text-[10px] font-black uppercase tracking-tighter mt-2">Add Anchor Monitor</p>
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card space-y-6">
                   <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/50">
                      <Zap size={18} className="text-amber-500" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Pressure Index</h3>
                   </div>
                   <div className="space-y-6 pt-4">
                      {['P0 Tier Backlog', 'P1 Operational Load', 'Global Escalations'].map((t, i) => (
                        <div key={t} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span>{t}</span>
                              <span className={i === 0 ? 'text-rose-600' : 'text-text-primary'}>{92 - i*15}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-subtle">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${92 - i*15}%` }}
                                 className={`h-full ${i === 0 ? 'bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.4)]' : 'bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]'}`}
                                 transition={{ duration: 1.5, ease: 'easeOut' }}
                               />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="card space-y-6">
                   <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/50">
                      <Activity size={18} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Sentinel Health</h3>
                   </div>
                   <div className="pt-4 flex flex-col justify-center h-full space-y-4">
                      <div className="flex justify-between p-3 bg-app-bg rounded-xl border border-border-subtle">
                         <span className="text-xs font-bold text-text-muted uppercase">Avg Response Time</span>
                         <span className="text-xs font-black">1.2m</span>
                      </div>
                      <div className="flex justify-between p-3 bg-app-bg rounded-xl border border-border-subtle">
                         <span className="text-xs font-bold text-text-muted uppercase">System Uptime</span>
                         <span className="text-xs font-black text-emerald-500">99.98%</span>
                      </div>
                      <div className="flex justify-between p-3 bg-app-bg rounded-xl border border-border-subtle">
                         <span className="text-xs font-bold text-text-muted uppercase">API Latency</span>
                         <span className="text-xs font-black">42ms</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Analytics Sidebar (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <Heatmap />

             <div className="card space-y-6">
                <div className="flex items-center gap-3">
                   <TrendingUp size={20} className="text-brand-primary" />
                   <h3 className="text-sm font-bold tracking-tight uppercase">Escalation Trends</h3>
                </div>
                <div className="text-center py-4">
                   <p className="text-5xl font-black text-rose-600 tracking-tighter">+14%</p>
                   <p className="text-[10px] font-black uppercase text-text-muted mt-2 tracking-widest">Weekly Breach Increase</p>
                </div>
                <button className="w-full py-4 bg-app-bg border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-subtle/10 hover:border-brand-primary transition-all">
                   Download Compliance Pack
                </button>
             </div>

             <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white p-0 overflow-hidden shadow-2xl">
                <div className="p-6 bg-brand-primary/10 border-b border-white/5 flex items-center justify-between">
                   <h3 className="text-xs font-black tracking-widest uppercase">Sentinel AI Digest</h3>
                   <Zap size={16} className="text-brand-primary" />
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                          <Activity size={20} className="text-brand-primary" />
                       </div>
                       <p className="text-xs leading-relaxed opacity-80 font-medium">"Anomalous breach pattern detected in <strong>Tier-2 Hardware Node</strong>. Recommended mass shift to <strong>Vault-L8</strong> backups."</p>
                    </div>
                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-colors">Apply Mitigation Protocol</button>
                </div>
             </div>

             <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
                <ShieldAlert size={24} />
                <CircleCheck size={24} />
                <Maximize2 size={24} />
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const CircleCheck = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default SLAMonitor;
