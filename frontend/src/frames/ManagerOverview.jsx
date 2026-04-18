import React from 'react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { 
  Users, 
  Map, 
  Search, 
  Filter, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Briefcase,
  TrendingUp,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const Sparkline = ({ color }) => {
  const data = [
    { v: 40 }, { v: 30 }, { v: 45 }, { v: 50 }, { v: 35 }, { v: 60 }, { v: 55 }
  ];
  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const MemberCard = ({ name, role, load, performance, avatarColor }) => (
  <div className="card space-y-4 relative group">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl`} style={{ backgroundColor: avatarColor }}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">{name}</h4>
          <p className="text-[10px] text-text-muted tracking-widest uppercase font-bold">{role}</p>
        </div>
      </div>
      <button className="p-1.5 hover:bg-app-bg rounded-lg transition-colors text-text-muted">
        <MoreVertical size={16} />
      </button>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
        <span>WORKLOAD CAP</span>
        <span className={load > 90 ? 'text-rose-500' : 'text-text-primary'}>{load}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-700 ${load > 90 ? 'bg-rose-500' : load > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
          style={{ width: `${load}%` }} 
        />
      </div>
    </div>

    <div className="flex justify-between items-end pt-2">
      <div className="space-y-0.5">
         <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">PERFORMANCE</p>
         <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-text-primary">{performance}%</span>
            <ArrowUpRight size={14} className="text-emerald-500" />
         </div>
      </div>
      <Sparkline color={performance > 90 ? '#10B981' : '#3B82F6'} />
    </div>

    {load > 90 && (
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce border-2 border-card-bg">
         <AlertTriangle size={14} />
      </div>
    )}
  </div>
);

const ManagerOverview = ({ onNext }) => {
  const team = [
    { name: 'Alex Rivera', role: 'Operations Lead', load: 85, performance: 94, color: '#3B82F6' },
    { name: 'Sarah Jenkins', role: 'Support Specialist', load: 92, performance: 88, color: '#8B5CF6' },
    { name: 'Marcus Thompson', role: 'Senior Auditor', load: 45, performance: 98, color: '#F59E0B' },
    { name: 'Elena Rodriguez', role: 'Agent Tier 2', load: 68, performance: 91, color: '#10B981' },
    { name: 'David Chen', role: 'Agent Tier 1', load: 74, performance: 85, color: '#EC4899' },
    { name: 'Sophie Miller', role: 'Compliance Lead', load: 32, performance: 99, color: '#06B6D4' },
  ];

  return (
    <AppLayout activePage="Team">
      <div className="max-w-[1500px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-tiny">TarkShastra Workforce HQ</p>
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-extrabold tracking-tight">Team Efficiency Protocol</h1>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold border border-emerald-500/20 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_var(--success)]" />
                  REAL-TIME SYNC
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="flex bg-input-bg p-1 rounded-xl border border-border-subtle shadow-inner">
                <button className="px-4 py-1.5 bg-card-bg text-brand-primary text-[10px] font-black uppercase rounded-lg shadow-sm">Grid View</button>
                <button className="px-4 py-1.5 text-text-muted text-[10px] font-black uppercase rounded-lg">List View</button>
             </div>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                SLA Monitor
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        {/* Global Critical Alert */}
        <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl flex items-center justify-between text-rose-600 shadow-sm relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
           <div className="flex items-center gap-5 relative z-10">
              <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20 animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div>
                 <p className="text-sm font-black uppercase tracking-tight">Unassigned Critical Breach</p>
                 <p className="text-xs font-semibold opacity-80">CMP-892 (Priority P0) has been unassigned for 45 minutes. Immediate action required to maintain SLA core.</p>
              </div>
           </div>
           <button className="relative z-10 bg-rose-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-500/20">
              EXECUTE REASSIGNMENT
           </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Team Grid (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map(m => (
                  <MemberCard key={m.name} {...m} avatarColor={m.color} />
                ))}
                <button className="card border-dashed border-2 flex flex-col items-center justify-center gap-4 text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-subtle/20 transition-all group min-h-[220px]">
                   <div className="w-14 h-14 rounded-2xl bg-app-bg border border-border-subtle flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <PlusCircle size={24} />
                   </div>
                   <div className="text-center">
                     <p className="text-xs font-black uppercase tracking-widest">Enlist Member</p>
                     <p className="text-[10px] font-medium opacity-60 mt-1">Add to Workforce Node</p>
                   </div>
                </button>
             </div>

             <div className="card space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Workload Heat Balance</h3>
                   <TrendingUp size={18} className="text-brand-primary" />
                </div>
                <div className="space-y-6">
                   {team.slice(0, 4).map(m => (
                     <div key={m.name} className="flex items-center gap-6">
                        <span className="text-xs font-bold w-32 truncate text-text-primary">{m.name}</span>
                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-subtle">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${m.load}%` }}
                             className={`h-full ${m.load > 90 ? 'bg-rose-500' : 'bg-brand-primary'}`}
                             transition={{ duration: 1, ease: 'easeOut' }}
                           />
                        </div>
                        <span className={`text-xs font-black w-12 text-right ${m.load > 90 ? 'text-rose-500' : 'text-text-primary'}`}>{m.load}%</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Composition Sidebar (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="card space-y-6">
                <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/30">
                   <Users size={20} className="text-brand-primary" />
                   <h3 className="text-sm font-bold tracking-tight uppercase">Fleet Distribution</h3>
                </div>
                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center p-4 bg-app-bg rounded-2xl border border-border-subtle hover:border-brand-primary/20 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform"><Map size={18} /></div>
                         <span className="text-sm font-bold">Remote Node (Global)</span>
                      </div>
                      <span className="font-black text-lg">14</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-app-bg rounded-2xl border border-border-subtle hover:border-purple-500/20 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg group-hover:scale-110 transition-transform"><Briefcase size={18} /></div>
                         <span className="text-sm font-bold">HQ Operations (SF)</span>
                      </div>
                      <span className="font-black text-lg">22</span>
                   </div>
                </div>
             </div>

             <div className="card !p-0 overflow-hidden group shadow-2xl">
                <div className="p-5 bg-brand-primary text-white flex items-center justify-between">
                   <h3 className="text-xs font-black tracking-widest uppercase">Capacity Intelligence</h3>
                   <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
                <div className="p-8 text-center space-y-3 relative overflow-hidden">
                   <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none" />
                   <h1 className="text-5xl font-black text-brand-primary tracking-tighter">72.4%</h1>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">Aggregate Fleet Load</p>
                   <div className="pt-6 flex justify-center gap-10">
                      <div>
                         <p className="text-xl font-bold text-rose-500">2</p>
                         <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Saturated</p>
                      </div>
                      <div className="h-8 w-px bg-border-subtle" />
                      <div>
                         <p className="text-xl font-bold text-emerald-500">4</p>
                         <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Optimized</p>
                      </div>
                   </div>
                </div>
                <footer className="p-4 bg-app-bg/50 border-t border-border-subtle text-center">
                   <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">Download Efficiency Audit</button>
                </footer>
             </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

// Internal Import helper
const PlusCircle = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
  </svg>
);

export default ManagerOverview;
