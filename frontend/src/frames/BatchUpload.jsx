import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Terminal as TerminalIcon,
  Database,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Trash2,
  RefreshCcw,
  Zap
} from 'lucide-react';

const ProgressStage = ({ title, status, active }) => (
  <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${active ? 'bg-brand-primary/5 border-brand-primary shadow-lg shadow-brand-primary/10' : 'bg-app-bg border-border-subtle opacity-60'}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'complete' ? 'bg-emerald-500 text-white' : status === 'error' ? 'bg-rose-500 text-white' : active ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30' : 'bg-card-bg text-text-muted border border-border-subtle'}`}>
      {status === 'complete' ? <CheckCircle2 size={24} /> : status === 'error' ? <AlertCircle size={24} /> : active ? <RefreshCcw size={20} className="animate-spin" /> : <FileText size={20} />}
    </div>
    <div className="flex-1 min-w-0">
       <h4 className="text-sm font-black tracking-tight uppercase text-text-primary">{title}</h4>
       <p className="text-[10px] font-bold text-text-muted tracking-wider">{status === 'complete' ? 'VALIDATED' : status === 'pending' ? 'QUEUEING' : 'ANALYZING'}</p>
    </div>
    {status === 'complete' && <div className="text-emerald-500 font-black text-[10px] tracking-tighter">100%</div>}
  </div>
);

const BatchUpload = ({ onNext }) => {
  const [stage, setStage] = useState(1);
  const [logs, setLogs] = useState([
    '[SYSTEM] Initializing IngestorNode v4.2.1-stable',
    '[SECURE] SSL Handshake established with Vault-L8',
    '[INGEST] Received payload (Type: JSON_COMPLAINT_LEDGER, Size: 14.8MB)',
  ]);

  useEffect(() => {
    if (stage < 4) {
      const timer = setTimeout(() => {
        setStage(s => s + 1);
        const newLogs = [...logs];
        if (stage === 1) newLogs.push('[PARSER] Decoding complaint schema... SUCCESS', '[AUTH] Verified 412 neural signatures');
        if (stage === 2) newLogs.push('[AI_CORE] Initiating sentiment extraction...', '[AI_CORE] Routing cases to Tier-1 nodes');
        setLogs(newLogs);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <AppLayout activePage="Complaints">
      <div className="max-w-[1500px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-tiny">TarkShastra Ingest Portal</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Bulk Ingress Protocol</h1>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold text-text-muted hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-sm">
                <Trash2 size={16} />
                Abort Ingest
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                Deployment View
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           
           {/* Progress Tracking (8 cols) */}
           <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <div className="card space-y-8">
                 <div className="flex justify-between items-center border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/50">
                    <div className="flex items-center gap-3">
                       <CloudUpload size={20} className="text-brand-primary" />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Active Ingress Sequence</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                       <Zap size={12} fill="currentColor" />
                       FLOW: 1.4 MB/s
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <ProgressStage title="Schema Validation" status={stage > 1 ? 'complete' : 'loading'} active={stage === 1} />
                    <ProgressStage title="Neural Enrichment" status={stage > 2 ? 'complete' : stage === 2 ? 'loading' : 'pending'} active={stage === 2} />
                    <ProgressStage title="Deduplication Audit" status={stage > 3 ? 'complete' : stage === 3 ? 'loading' : 'pending'} active={stage === 3} />
                    <ProgressStage title="Vault Committal" status={stage === 4 ? 'complete' : 'pending'} active={stage === 4} />
                 </div>

                 <div className="space-y-4 pt-4 text-text-primary">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-tiny uppercase tracking-widest text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">GLOBAL PROGRESSION</p>
                          <h4 className="text-lg font-bold">Encrypted Data Stream</h4>
                       </div>
                       <span className="text-brand-primary font-black text-xl italic">{Math.round((stage/4)*100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-subtle p-0.5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(stage/4)*100}%` }}
                         className="h-full bg-brand-primary rounded-full shadow-[0_0_15px_var(--primary)]"
                         transition={{ duration: 1, ease: 'easeOut' }}
                       />
                    </div>
                 </div>
              </div>

              {/* Console Logs */}
              <div className="card !p-0 bg-slate-900 border-slate-700 shadow-2xl overflow-hidden group">
                 <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <TerminalIcon size={16} className="text-slate-400" />
                       <p className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest">Diagnostic Stream v4.2</p>
                    </div>
                    <div className="flex gap-1.5 px-3 py-1 bg-slate-950 rounded border border-slate-800 font-mono text-[9px] text-emerald-500 font-bold">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-0.5" />
                       REAL_TIME_FEED
                    </div>
                 </div>
                 <div className="p-6 font-mono text-xs text-slate-400 space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                    {logs.map((log, i) => (
                      <div key={i} className={`flex gap-4 group/line ${log.includes('SUCCESS') ? 'text-emerald-500' : ''}`}>
                         <span className="opacity-20 select-none w-6">{i + 1}</span>
                         <span className="group-hover/line:text-slate-200 transition-colors">{log}</span>
                      </div>
                    ))}
                    <div className="w-1 h-3 bg-brand-primary animate-pulse inline-block ml-10" />
                 </div>
              </div>
           </div>

           {/* Stats Sidebar (4 cols) */}
           <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="card space-y-6">
                 <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/30">
                    <Database size={20} className="text-brand-primary" />
                    <h3 className="text-sm font-bold tracking-tight uppercase">Ingress Manifest</h3>
                 </div>
                 <div className="space-y-4 pt-4">
                    {[
                      { l: 'Total Units', v: '14,220', i: FileText, c: 'text-brand-primary' },
                      { l: 'Unique Entities', v: '8,421', i: Cpu, c: 'text-violet-500' },
                      { l: 'P0 Criticals', v: '142', i: ShieldCheck, c: 'text-rose-500' },
                    ].map(s => (
                      <div key={s.l} className="flex justify-between items-center p-4 bg-app-bg rounded-2xl border border-border-subtle group hover:border-brand-primary/20 transition-colors">
                         <div className="flex items-center gap-4 text-text-primary">
                            <div className={`p-2 rounded-lg bg-card-bg border border-border-subtle group-hover:scale-110 transition-transform ${s.c}`}><s.i size={18} /></div>
                            <span className="text-sm font-bold">{s.l}</span>
                         </div>
                         <span className="font-black text-lg text-text-primary">{s.v}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="card bg-brand-primary text-white space-y-4 shadow-2xl shadow-brand-primary/20 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                 <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                 
                 <div className="relative z-10 flex items-center justify-between">
                    <h3 className="text-xs font-black tracking-widest uppercase opacity-80">Encryption Node</h3>
                    <ShieldCheck size={20} />
                 </div>
                 <div className="relative z-10 space-y-1">
                    <p className="text-[10px] font-mono opacity-60">MASTER_SHA</p>
                    <p className="text-xs font-mono font-black tracking-tighter truncate">EF20-112B-AA88-FB12-66C2</p>
                 </div>
                 <div className="relative z-10 pt-4 border-t border-white/20">
                    <p className="text-[11px] leading-relaxed italic opacity-90 font-medium">
                       "All data is shredded after neural extraction. No raw text is persisted in the ledger."
                    </p>
                 </div>
              </div>

              <div className="card !p-0 overflow-hidden bg-app-bg border-dashed text-text-primary flex items-center gap-4 p-5 text-amber-600">
                 <div className="p-3 bg-amber-500/10 rounded-xl"><Clock size={24} /></div>
                 <div>
                    <p className="text-xs font-bold uppercase tracking-widest leading-none">EST. Completion</p>
                    <p className="text-lg font-black tracking-tight mt-1">14m 22s <span className="text-[10px] opacity-60">Remaining</span></p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default BatchUpload;
