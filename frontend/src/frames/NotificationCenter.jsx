import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
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
  Cpu
} from 'lucide-react';

const NotificationItem = ({ type, title, message, time, read, onRead }) => {
  const icons = {
    'security': <ShieldAlert size={18} className="text-rose-500" />,
    'system': <Cpu size={18} className="text-brand-primary" />,
    'check': <CheckCircle2 size={18} className="text-emerald-500" />,
    'alert': <AlertCircle size={18} className="text-amber-500" />,
    'mail': <Mail size={18} className="text-violet-500" />,
  };

  return (
    <div 
      className={`p-5 rounded-2xl border transition-all cursor-pointer group flex gap-5 ${
        read 
          ? 'bg-card-bg border-border-subtle opacity-80' 
          : 'bg-brand-subtle/40 border-brand-primary/20 shadow-lg shadow-brand-primary/5'
      } hover:border-brand-primary/50`}
      onClick={onRead}
    >
      <div className={`p-3 rounded-xl shrink-0 ${read ? 'bg-app-bg text-text-muted' : 'bg-white shadow-sm ring-1 ring-brand-primary/10'}`}>
        {icons[type] || <Info size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
           <h4 className={`text-sm font-bold tracking-tight truncate ${read ? 'text-text-primary' : 'text-brand-primary'}`}>{title}</h4>
           <span className="text-[10px] font-mono font-black text-text-muted flex items-center gap-1.5 shrink-0 ml-4 group-hover:text-text-primary transition-colors">
              <Clock size={10} />
              {time}
           </span>
        </div>
        <p className={`text-xs leading-relaxed ${read ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>{message}</p>
        {!read && <div className="mt-3 flex gap-2">
           <button className="px-3 py-1 bg-brand-primary text-white text-[9px] font-black uppercase rounded shadow-sm hover:bg-brand-hover transition-all">Mark Read</button>
           <button className="px-3 py-1 bg-app-bg text-text-muted text-[9px] font-black uppercase rounded border border-border-subtle hover:text-text-primary transition-all">Details</button>
        </div>}
      </div>
      <div className="flex flex-col justify-between items-end">
         <button className="p-1 text-text-muted hover:bg-card-bg rounded transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={14} /></button>
         {!read && <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_var(--primary)]" />}
      </div>
    </div>
  );
};

const NotificationCenter = ({ onNext }) => {
  const [activeTab, setActiveTab] = useState('All');
  
  const notifications = [
    { id: 1, type: 'security', title: 'Critical SLA Breach: CMP-821', message: 'Region Hub-SF reports a P0 category delay exceeding 120 minutes in hardware node TS-X1.', time: '12m ago', read: false },
    { id: 2, type: 'mail', title: 'New Customer Discourse', message: 'Nexus Systems has responded to the investigation audit regarding the Q1 billing cycle discrepancy.', time: '45m ago', read: false },
    { id: 3, type: 'system', title: 'Neural Model v4.2 Deployed', message: 'Synthetic inference engine has been successfully updated across all secondary vault nodes.', time: '2h ago', read: true },
    { id: 4, type: 'check', title: 'Batch Verification Complete', message: '4,102 complaints have been verified and committed to the immutable ledger.', time: '4h ago', read: true },
    { id: 5, type: 'alert', title: 'Floor Manager Sync Required', message: 'Weekly operational throughput is currently 4.2% below the optimal threshold.', time: '8h ago', read: true },
  ];

  return (
    <AppLayout activePage="Dashboard">
      <div className="max-w-[1200px] mx-auto pb-12 text-text-primary">
        <header className="flex justify-between items-end mb-10">
          <div className="space-y-1">
             <p className="text-tiny">TarkShastra Event Ledger</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Sentinel Communications</h1>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm">
                <CheckCircle2 size={16} />
                Clear Read
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                <Trash2 size={16} />
                Purge All
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
           
           {/* Sidebar Filter */}
           <div className="col-span-12 lg:col-span-3 space-y-8">
              <div className="relative">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                 <input 
                   type="text" 
                   placeholder="Search events..."
                   className="input-field pl-12 h-12 bg-app-bg border-2 border-transparent focus:border-brand-primary focus:bg-card-bg"
                 />
              </div>

              <div className="card !p-2 flex flex-col gap-1 bg-app-bg/50 border-dashed">
                 {['All', 'Authority', 'System', 'Communications'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                       activeTab === tab ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'text-text-secondary hover:bg-brand-subtle hover:text-brand-primary'
                     }`}
                   >
                      {tab}
                      {tab === 'All' && <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>5</span>}
                   </button>
                 ))}
              </div>

              <div className="card space-y-4">
                 <div className="flex items-center gap-3 text-brand-primary">
                    <Filter size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Filter Matrix</h3>
                 </div>
                 <div className="space-y-3 pt-2">
                    {['Priority Only', 'Neural Alerts', 'System Updates'].map(f => (
                       <label key={f} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-border-subtle text-brand-primary focus:ring-brand-primary/20" />
                          <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">{f}</span>
                       </label>
                    ))}
                 </div>
              </div>
           </div>

           {/* Notifications Feed */}
           <div className="col-span-12 lg:col-span-9 space-y-6">
              <div className="flex items-center justify-between text-tiny font-black px-2">
                 <span className="text-text-muted uppercase tracking-[0.2em]">Latest Broadcasts</span>
                 <span className="flex items-center gap-2 text-brand-primary"><Zap size={12} fill="currentColor" /> Live Feed Active</span>
              </div>
              
              <div className="space-y-4">
                 <AnimatePresence mode="popLayout">
                    {notifications.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                         <NotificationItem {...n} />
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              <div className="pt-8 text-center">
                 <button className="px-10 py-3 bg-app-bg border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-brand-primary hover:border-brand-primary/50 transition-all shadow-sm">
                    Load Archived Protocols
                 </button>
              </div>
           </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationCenter;
