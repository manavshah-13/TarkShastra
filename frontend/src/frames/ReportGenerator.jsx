import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Settings, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Search,
  Calendar,
  Layers,
  Database,
  Cpu,
  Trash2,
  ExternalLink,
  ShieldCheck,
  MoreVertical,
  Clock
} from 'lucide-react';

const StepIndicator = ({ current, total }) => (
  <div className="flex items-center gap-3">
    {[...Array(total)].map((_, i) => (
      <div key={i} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
          i + 1 < current ? 'bg-emerald-500 text-white' : 
          i + 1 === current ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-110' : 
          'bg-app-bg text-text-muted border border-border-subtle'
        }`}>
          {i + 1 < current ? <Check size={16} strokeWidth={3} /> : i + 1}
        </div>
        {i + 1 < total && (
           <div className={`w-10 h-0.5 mx-1 ${i + 1 < current ? 'bg-emerald-500' : 'bg-border-subtle'}`} />
        )}
      </div>
    ))}
  </div>
);

const ReportGenerator = ({ onNext }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const startGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNext();
    }, 2500);
  };

  const history = [
    { id: 'REP-X001', type: 'System Audit', date: 'Mar 12, 09:44 AM', size: '2.4 MB', status: 'Ready' },
    { id: 'REP-Y882', type: 'SLA Analysis', date: 'Mar 11, 04:12 PM', size: '1.1 MB', status: 'Archived' },
  ];

  return (
    <AppLayout activePage="Analytics">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
             <p className="text-tiny">TarkShastra Ledger Intel</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Report Engineering Studio</h1>
          </div>
          <StepIndicator current={step} total={3} />
        </header>

        <div className="grid grid-cols-12 gap-8">
           
           {/* Wizard Canvas (8 cols) */}
           <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <div className="card min-h-[500px] flex flex-col relative overflow-hidden">
                 <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 flex-1"
                      >
                         <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl"><Layers size={24} /></div>
                            <div>
                               <h3 className="text-xl font-bold tracking-tight">Template Selection</h3>
                               <p className="text-sm text-text-secondary opacity-80">Define the schema and structure of your intelligence output</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { t: 'Strategic Summary', d: 'High-level KPI overview for executive review.', i: FileText },
                              { t: 'Operational Audit', d: 'Granular complaint tracking and agent throughput.', i: Settings },
                              { t: 'Safety & Risk', d: 'Detailed analysis of P0 breaches and safety leaks.', i: Database },
                              { t: 'Neural Insight', d: 'Model accuracy reports and SHAP influence logs.', i: Cpu },
                            ].map(item => (
                              <button key={item.t} className="p-6 text-left bg-app-bg border border-border-subtle rounded-2xl hover:border-brand-primary hover:bg-brand-subtle transition-all group flex flex-col gap-4">
                                 <div className="p-2 bg-card-bg rounded-lg border border-border-subtle group-hover:text-brand-primary group-hover:scale-110 transition-transform w-fit"><item.i size={20} /></div>
                                 <div>
                                    <h4 className="font-bold text-sm mb-1">{item.t}</h4>
                                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{item.d}</p>
                                 </div>
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                       <motion.div 
                         key="step2"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="space-y-8 flex-1"
                       >
                          <div className="flex items-center gap-4 mb-8">
                             <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl"><Calendar size={24} /></div>
                             <div>
                                <h3 className="text-xl font-bold tracking-tight">Parameter Logic</h3>
                                <p className="text-sm text-text-secondary opacity-80">Define date spans, filter depths, and metadata inclusion</p>
                             </div>
                          </div>
                          
                          <div className="space-y-6">
                             <div className="space-y-3">
                                <label className="text-tiny text-text-muted font-black tracking-[0.15em] uppercase">Time Horizon</label>
                                <div className="flex gap-3">
                                   {['L-24H', 'L-7D', 'L-30D', 'QTD'].map(h => (
                                     <button key={h} className="flex-1 py-3 bg-app-bg border border-border-subtle rounded-xl text-xs font-bold text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all uppercase">{h}</button>
                                   ))}
                                </div>
                             </div>
                             
                             <div className="space-y-3">
                                <label className="text-tiny text-text-muted font-black tracking-[0.15em] uppercase">Entity Scoping</label>
                                <div className="relative">
                                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                   <input 
                                     type="text" 
                                     placeholder="Search for specific Clients, Nodes, or Agents..."
                                     className="input-field pl-12 h-14 bg-app-bg border-2 border-transparent focus:border-brand-primary focus:bg-card-bg"
                                   />
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}

                    {step === 3 && (
                       <motion.div 
                         key="step3"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="flex flex-col items-center justify-center flex-1 h-full text-center space-y-6 pb-20"
                       >
                          <div className="p-8 bg-brand-primary/10 border border-brand-primary/20 rounded-full relative overflow-hidden group">
                             <motion.div 
                               animate={{ rotate: 360 }}
                               transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                               className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                             />
                             <div className="relative z-10 p-6 bg-brand-primary text-white rounded-full shadow-2xl shadow-brand-primary/40">
                                <Download size={48} />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-2xl font-black tracking-tight">Generation Matrix Ready</h3>
                             <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                                All parameters have been validated through protocolTS-882. 
                                Click below to start the neural render sequence.
                             </p>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {/* Controls */}
                 <div className="mt-auto pt-8 border-t border-border-subtle flex justify-between items-center bg-app-bg/30 -m-6 p-6 mt-8">
                    {step > 1 ? (
                      <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest">
                         <ChevronLeft size={20} />
                         REVISE STEP
                      </button>
                    ) : <div />}
                    
                    {step < 3 ? (
                      <button onClick={() => setStep(step + 1)} className="btn-primary flex items-center gap-2 px-10 relative group">
                         CONTINUE TO LOGIC
                         <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button 
                        onClick={startGeneration} 
                        disabled={isGenerating}
                        className="btn-primary flex items-center gap-3 px-10 relative overflow-hidden h-12 shadow-2xl shadow-brand-primary/30"
                      >
                         <AnimatePresence mode="wait">
                            {isGenerating ? (
                               <motion.div 
                                 key="gen"
                                 initial={{ y: 20, opacity: 0 }}
                                 animate={{ y: 0, opacity: 1 }}
                                 exit={{ y: -20, opacity: 0 }}
                                 className="flex items-center gap-3"
                               >
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Processing Matrix...</span>
                               </motion.div>
                            ) : (
                               <motion.div 
                                 key="idle"
                                 initial={{ y: 20, opacity: 0 }}
                                 animate={{ y: 0, opacity: 1 }}
                                 exit={{ y: -20, opacity: 0 }}
                                 className="flex items-center gap-2"
                               >
                                  <Cpu size={18} />
                                  <span className="font-extrabold uppercase">START NEURAL RENDER</span>
                               </motion.div>
                            )}
                         </AnimatePresence>
                      </button>
                    )}
                 </div>
              </div>
           </div>

           {/* History Sidebar (4 cols) */}
           <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              <div className="card space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <History size={18} className="text-brand-primary" />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Recent Exports</h3>
                    </div>
                    <button className="text-[10px] font-black uppercase text-brand-primary hover:underline">Clean All</button>
                 </div>
                 
                 <div className="space-y-4">
                    {history.map(item => (
                       <div key={item.id} className="p-4 bg-app-bg border border-border-subtle rounded-2xl group transition-all hover:border-brand-primary/30">
                          <div className="flex justify-between items-start mb-3">
                             <div>
                                <h4 className="text-xs font-bold text-text-primary">{item.type}</h4>
                                <p className="text-[10px] text-text-muted mt-0.5">{item.date}</p>
                             </div>
                             <button className="p-1 hover:bg-card-bg rounded transition-colors text-text-muted"><MoreVertical size={14} /></button>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-border-subtle/50">
                             <div className="flex gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${item.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-slate-200 text-slate-500'}`}>{item.status}</span>
                                <span className="text-[9px] font-mono text-text-muted p-0.5">{item.size}</span>
                             </div>
                             <button className="p-2 bg-card-bg rounded-lg text-text-muted hover:text-brand-primary shadow-sm hover:scale-110 transition-transform"><Download size={14} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="card border-brand-primary/20 bg-brand-primary/5 space-y-4 shadow-xl shadow-brand-primary/5">
                 <div className="flex items-center gap-3 text-brand-primary">
                    <ShieldCheck size={20} />
                    <h3 className="text-sm font-bold tracking-tight uppercase">Access Control</h3>
                 </div>
                 <p className="text-xs text-text-secondary leading-relaxed opacity-90">
                    Intelligence reports are encrypted with your <strong>System Authority SHA</strong>. 
                    Redistribution outside the <strong>Vault-S6</strong> is strictly logged.
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-primary group">
                    View Access Log
                    <ExternalLink size={12} className="group-hover:scale-125 transition-transform" />
                 </button>
              </div>

              <div className="card !p-0 overflow-hidden bg-app-bg border-dashed text-text-primary">
                 <div className="p-6 bg-amber-500/10 flex items-center gap-4 text-amber-700">
                    <Clock size={24} />
                    <div>
                       <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Auto-Purge Alert</p>
                       <p className="text-[10px] font-medium opacity-70">Next cycle in 14h 22m</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </AppLayout>
  );
};

// Internal History Icon helper
const History = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);

export default ReportGenerator;
