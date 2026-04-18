import React from 'react';
import AppLayout from '../components/AppLayout';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  MoreHorizontal, 
  Download, 
  ArrowUpRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Badge = ({ children, status }) => {
  const styles = {
    'Priority P0': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'Escalated': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Investigating': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    'Resolved': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {children}
    </span>
  );
};

const QueueView = ({ onNext }) => {
  const tableData = [
    { id: 'CMP-821', user: 'Velocity Corp', subject: 'Total Screen Failure: Tark-X Module', status: 'Priority P0', time: '12m ago', category: 'Hardware' },
    { id: 'CMP-744', user: 'Nexus Systems', subject: 'Billing Discrepancy: Q1 Cycle', status: 'Escalated', time: '45m ago', category: 'Billing' },
    { id: 'CMP-902', user: 'Orbital Dynamics', subject: 'Sensor Artifacting: Model Beta', status: 'Investigating', time: '1h ago', category: 'Hardware' },
    { id: 'CMP-881', user: 'Lumina Tech', subject: 'Response Latency in Neural Ingest', status: 'Resolved', time: '2h ago', category: 'Software' },
    { id: 'CMP-552', user: 'Solaris Mfg', subject: 'Safety Protocol Breach: Region 4', status: 'Priority P0', time: '4h ago', category: 'Safety' },
    { id: 'CMP-412', user: 'Aetheria Labs', subject: 'Duplicate Ticket Entry Error', status: 'Resolved', time: '8h ago', category: 'Other' },
  ];

  return (
    <AppLayout activePage="Complaints">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Master Complaint Ledger</h1>
            <p className="text-text-secondary">Central command for high-velocity complaint triage and audit logs</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary transition-all shadow-sm">
                <Download size={16} />
                Export CSV
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                Batch Verification
                <ArrowUpRight size={18} />
             </button>
          </div>
        </header>

        {/* Global Filter Bar */}
        <div className="card !p-3 flex items-center gap-4 bg-app-bg/50 border-dashed">
           <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Query by case ID, client name, or neural fingerprint..."
                className="w-full bg-card-bg border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
           </div>
           <div className="h-8 w-px bg-border-subtle" />
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-xs font-bold text-text-muted hover:text-text-primary transition-all">
                 <Filter size={14} />
                 ALL CATEGORIES
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-xs font-bold text-brand-primary">
                 STATUS: OPEN
              </button>
           </div>
        </div>

        {/* Ledger Table */}
        <div className="card p-0 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-app-bg/80 border-b border-border-subtle">
                    <tr>
                       <th className="p-4 text-tiny">Case Identity</th>
                       <th className="p-4 text-tiny">Subject & Insight</th>
                       <th className="p-4 text-tiny">Authority Node</th>
                       <th className="p-4 text-tiny">System Status</th>
                       <th className="p-4 text-tiny">Time Delta</th>
                       <th className="p-4"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border-subtle">
                    {tableData.map((row) => (
                      <tr key={row.id} className="hover:bg-brand-subtle/30 transition-colors group cursor-pointer">
                         <td className="p-4">
                            <span className="font-mono text-xs font-bold text-brand-primary">{row.id}</span>
                            <p className="text-xs font-semibold text-text-primary pt-1">{row.user}</p>
                         </td>
                         <td className="p-4 max-w-md">
                            <div className="flex flex-col gap-1">
                               <span className="text-sm font-semibold truncate group-hover:text-brand-primary transition-colors">{row.subject}</span>
                               <span className="text-[10px] text-text-muted uppercase font-bold flex items-center gap-1.5">
                                 <div className={`w-1.5 h-1.5 rounded-full ${row.category === 'Hardware' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                                 {row.category}
                               </span>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex -space-x-1.5 overflow-hidden">
                               {[1, 2].map(i => <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-card-bg bg-slate-200 dark:bg-slate-700" />)}
                            </div>
                         </td>
                         <td className="p-4">
                            <Badge status={row.status}>{row.status}</Badge>
                         </td>
                         <td className="p-4">
                            <span className="text-[10px] font-mono text-text-muted flex items-center gap-2">
                               <Clock size={12} />
                               {row.time}
                            </span>
                         </td>
                         <td className="p-4 text-right">
                            <button className="p-2 text-text-muted hover:text-text-primary group-hover:bg-card-bg rounded-lg transition-all">
                               <MoreHorizontal size={18} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Pagination */}
           <footer className="px-6 py-4 bg-app-bg/50 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">Viewing <span className="text-text-primary font-bold">1 - 6</span> of 1,422 neural records</span>
              <div className="flex items-center gap-2">
                 <button className="p-2 border border-border-subtle rounded-lg text-text-muted hover:bg-card-bg disabled:opacity-20" disabled>
                    <ChevronLeft size={18} />
                 </button>
                 <button className="p-2 border border-border-subtle rounded-lg text-text-muted hover:bg-card-bg shadow-sm">
                    <ChevronRight size={18} />
                 </button>
              </div>
           </footer>
        </div>

        {/* Global Summary Statistics Mini-grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { l: 'P0 BACKLOG', v: '14', i: ShieldAlert, c: 'text-rose-500' },
             { l: 'AVG TRIAGE', v: '0.8h', i: Clock, c: 'text-brand-primary' },
             { l: 'AUTONOMOUS', v: '82%', i: CheckCircle2, c: 'text-emerald-500' },
             { l: 'TOTAL FLOW', v: '24K', i: AlertCircle, c: 'text-text-muted' },
           ].map(s => (
             <div key={s.l} className="card !p-4 flex items-center gap-4">
                <s.i size={18} className={s.c} />
                <div>
                   <p className="text-[9px] font-black tracking-widest text-text-muted uppercase leading-tight">{s.l}</p>
                   <p className="text-xl font-bold text-text-primary">{s.v}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default QueueView;
