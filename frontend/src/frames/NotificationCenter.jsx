import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  Search, 
  Filter,
  Trash2,
  ChevronRight,
  Info,
  Zap,
  Mail,
  Cpu,
  RefreshCcw,
  X,
  ArrowRight
} from 'lucide-react';

const NotificationItem = ({ data, onDismiss, onRead }) => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const scale = useTransform(x, [-150, 0, 150], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-150, 0, 150], [-5, 0, 5]);

  const icons = {
    'security': <ShieldAlert size={20} className="text-rose-500" />,
    'system': <Cpu size={20} className="text-brand-primary" />,
    'check': <CheckCircle2 size={20} className="text-emerald-500" />,
    'alert': <AlertCircle size={20} className="text-amber-500" />,
    'mail': <Mail size={20} className="text-violet-500" />,
  };

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onDismiss(data.id);
    }
  };

  return (
    <motion.div
      style={{ x, opacity, scale, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="relative mb-4 cursor-grab active:cursor-grabbing"
    >
      {/* Background Actions (Visible when swiping) */}
      <div className="absolute inset-0 flex items-center justify-between px-10 rounded-3xl bg-rose-500/10 pointer-events-none">
         <div className="flex items-center gap-2 text-rose-500 opacity-40">
            <Trash2 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Archive</span>
         </div>
         <div className="flex items-center gap-2 text-rose-500 opacity-40">
            <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
            <Trash2 size={20} />
         </div>
      </div>

      <div 
        onClick={() => data.complaintId ? navigate(`/complaints/${data.complaintId}`) : onRead?.(data.id)}
        className={`relative z-10 p-8 rounded-[32px] border transition-all flex gap-8 ${
          data.read 
            ? 'bg-[#1e293b]/40 border-white/5 opacity-60 grayscale-[0.5]' 
            : 'bg-[#1e293b]/80 border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)]'
        } hover:border-brand-primary/40`}
      >
        <div className={`w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center ${data.read ? 'bg-slate-900 shadow-inner' : 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl border border-white/5 ring-1 ring-white/10'}`}>
          {icons[data.type] || <Info size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
             <div className="space-y-1">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${data.read ? 'text-slate-500' : 'text-brand-primary'}`}>{data.type} node</p>
                <h4 className={`text-lg font-black tracking-tight truncate ${data.read ? 'text-slate-200' : 'text-white'}`}>{data.title}</h4>
             </div>
             <span className="text-[10px] font-mono font-black text-slate-500 flex items-center gap-2 shrink-0 ml-4 group-hover:text-white transition-colors">
                <Clock size={12} className="text-brand-primary" />
                {data.time}
             </span>
          </div>
          <p className={`text-sm leading-relaxed max-w-2xl ${data.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>{data.message}</p>
          
          <AnimatePresence>
            {!data.read && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 flex gap-3"
              >
                 <button className="px-6 py-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all">Engage Case</button>
                 <button onClick={(e) => { e.stopPropagation(); onRead(data.id); }} className="px-6 py-2 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 hover:bg-slate-700 transition-all">Squelch Notification</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col justify-between items-end shrink-0">
           <button className="p-2 text-slate-500 hover:bg-white/5 rounded-xl transition-all"><MoreVertical size={16} /></button>
           {!data.read && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }} 
               className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_12px_var(--primary)]" 
             />
           )}
        </div>
      </div>
    </motion.div>
  );
};

export const NotificationFeed = ({ standalone = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'security', title: 'Critical SLA Breach: CMP-821', message: 'Region Hub-SF reports a P0 category delay exceeding 120 minutes in hardware node TS-X1. Protocol Sentinel expects manual override within 14m.', time: '12m ago', read: false, complaintId: '821' },
    { id: 2, type: 'mail', title: 'New Customer Discourse', message: 'Nexus Systems has responded to the investigation audit regarding the Q1 billing cycle discrepancy. Neural extraction indicates high sentiment volatility.', time: '45m ago', read: false },
    { id: 3, type: 'system', title: 'Neural Model v4.2 Deployed', message: 'Synthetic inference engine has been successfully updated across all secondary vault nodes. Shard rebalancing in progress.', time: '2h ago', read: true },
    { id: 4, type: 'check', title: 'Batch Verification Complete', message: '4,102 complaints have been verified and committed to the immutable ledger. SHA-256 signatures generated for root audit.', time: '4h ago', read: true },
    { id: 5, type: 'alert', title: 'Floor Manager Sync Required', message: 'Weekly operational throughput is currently 4.2% below the optimal threshold. Reassignment of 14 cases recommended.', time: '8h ago', read: true },
  ]);

  const handleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const currentNotifications = activeTab === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab.toLowerCase());

  return (
    <div className={`grid grid-cols-12 gap-12 ${standalone ? '' : 'p-6'}`}>
       
       {/* Navigation & Controls */}
       <div className={`col-span-12 ${standalone ? 'lg:col-span-3' : 'lg:col-span-12'} space-y-8`}>
          {standalone && (
            <div className="relative group">
               <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-brand-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search frequency..."
                 className="w-full h-16 bg-[#0F172A]/40 backdrop-blur-xl border-2 border-slate-800 rounded-[32px] pl-16 pr-6 text-sm font-bold text-white focus:outline-none focus:border-brand-primary transition-all shadow-inner"
               />
            </div>
          )}

          <div className="card !p-3 space-y-1 bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 rounded-[32px]">
             {['All', 'Security', 'System', 'Mail', 'Alert'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`w-full flex items-center justify-between px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-[1.02]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                  <span className="flex items-center gap-3">
                     {tab === 'All' ? <Bell size={16} /> : tab === 'Security' ? <ShieldAlert size={16} /> : tab === 'System' ? <Cpu size={16} /> : tab === 'Mail' ? <Mail size={16} /> : <AlertCircle size={16} />}
                     {tab}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black ${activeTab === tab ? 'bg-white/20' : 'bg-slate-800/50 text-brand-primary'}`}>
                    {tab === 'All' ? notifications.length : notifications.filter(x => x.type === tab.toLowerCase()).length}
                  </span>
               </button>
             ))}
          </div>

          {standalone && (
            <div className="card space-y-6 !bg-brand-primary/5 border-dashed border-brand-primary/20 !p-8 !rounded-[32px]">
               <div className="flex items-center gap-3 text-brand-primary">
                  <Filter size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Logic Filters</h3>
               </div>
               <div className="space-y-4 pt-2">
                  {['Priority_Only', 'Neural_Triggers', 'Audit_Updates'].map(f => (
                     <label key={f} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative w-5 h-5">
                           <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                           <div className="w-5 h-5 rounded-md border-2 border-slate-700 bg-slate-900 peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-all flex items-center justify-center">
                              <Check size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform" strokeWidth={4} />
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{f}</span>
                     </label>
                  ))}
               </div>
            </div>
          )}
       </div>

       {/* Notifications Feed */}
       <div className={`col-span-12 ${standalone ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-8`}>
          {standalone && (
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <Zap size={20} className="text-emerald-500 fill-emerald-500/20" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Temporal Broadcast Stream</h3>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-600 bg-slate-900 px-4 py-2 rounded-full border border-white/5">
                  SYNC_FREQ: 2.4 HZ
               </div>
            </div>
          )}
          
          <div className="space-y-4">
             <AnimatePresence mode="popLayout">
                {currentNotifications.length > 0 ? (
                   currentNotifications.map((n, i) => (
                     <motion.div
                       key={n.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       transition={{ duration: 0.3 }}
                       layout
                     >
                        <NotificationItem data={n} onRead={handleRead} onDismiss={handleDismiss} />
                     </motion.div>
                   ))
                ) : (
                   <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-6 bg-slate-900/40 rounded-[48px] border border-dashed border-slate-800">
                      <CheckCircle2 size={48} className="text-slate-700" />
                      <p className="text-sm text-slate-500 font-medium">All neural comms cleared.</p>
                   </div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
};

const NotificationCenter = () => {
  return (
    <AppLayout activePage="Notifications">
      <div className="max-w-[1500px] mx-auto pb-12 text-text-primary px-6">
        <header className="flex justify-between items-end mb-12">
          <div className="space-y-1">
             <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra Event Ledger</p>
             <h1 className="text-4xl font-black tracking-tight">Sentinel Communications</h1>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-3 px-6 py-3 border border-border-subtle rounded-2xl text-[10px] font-black uppercase text-text-muted hover:text-white transition-all shadow-sm">
                <CheckCircle2 size={16} />
                Validate All
             </button>
             <button className="btn-primary flex items-center gap-3 px-8 shadow-2xl shadow-brand-primary/30">
                <Trash2 size={16} />
                Purge Stream
             </button>
          </div>
        </header>

        <NotificationFeed standalone={true} />
      </div>
    </AppLayout>
  );
};

export default NotificationCenter;


// Internal icon and style helpers
const Check = ({ size, className, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
