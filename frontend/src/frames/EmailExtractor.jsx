import React from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  RefreshCcw, 
  Trash2, 
  ArrowRightLeft,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  Zap,
  Fingerprint
} from 'lucide-react';

const ConfidenceMarker = ({ score }) => {
  const isHigh = score > 0.9;
  return (
    <div className="flex items-center gap-2 px-2 py-0.5 bg-app-bg rounded-lg border border-border-subtle group hover:border-brand-primary/30 transition-all">
       <div className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-emerald-500 shadow-[0_0_5px_var(--success)]' : 'bg-amber-500 shadow-[0_0_5px_var(--warning)]'}`} />
       <span className="text-[10px] font-mono font-black text-text-muted">{Math.round(score * 100)}%</span>
    </div>
  );
};

const EmailExtractor = ({ onNext }) => {
  return (
    <AppLayout activePage="New Complaint">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-tiny">TarkShastra Neural Parser</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Email Intelligence Reconstruction</h1>
             <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-black border border-brand-primary/20">AGENT_v1.2</span>
                <span className="text-[10px] text-text-muted font-bold flex items-center gap-1"><Fingerprint size={12} /> SHA-8812B</span>
             </div>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold text-text-muted hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-sm">
                <RefreshCcw size={16} />
                Re-process Raw
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2 group shadow-xl shadow-brand-primary/20">
                Commit Extraction
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           
           {/* Side-by-Side Reconstruction Area (8 cols) */}
           <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <div className="card !p-0 overflow-hidden border-2 border-brand-primary/10 shadow-2xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    
                    {/* Raw Input */}
                    <div className="p-8 space-y-6 border-r border-border-subtle flex flex-col">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-text-muted">
                             <Mail size={18} />
                             <h3 className="text-xs font-black uppercase tracking-widest">Raw Ingress Source</h3>
                          </div>
                          <span className="text-[10px] font-mono opacity-40">Mar 12, 10:44:21</span>
                       </div>
                       
                       <div className="flex-1 bg-app-bg p-6 rounded-2xl border border-border-subtle font-mono text-xs leading-relaxed text-text-secondary whitespace-pre-wrap select-all">
                          {"Subject: Re: Fwd: CMP-821 - Screen Issue\n\nDear Team,\n\nI'm writing to report that our device (Serial #TS-992) is essentially toast. There is a weird liquid leaking from the bezel. It smells like ozone? \n\nI had Sarah check it but she was confused. Pls help.\n\nBest,\nAlex R."}
                       </div>

                       <div className="pt-4 flex items-center gap-3">
                          <label className="text-tiny opacity-60">Source Node:</label>
                          <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">HUB-INTERNAL-S6</span>
                       </div>
                    </div>

                    {/* Neural Reconstruction */}
                    <div className="p-8 space-y-6 bg-brand-primary/5 flex flex-col relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent pointer-events-none" />
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3 text-brand-primary">
                             <Cpu size={18} />
                             <h3 className="text-xs font-black uppercase tracking-widest">Neural Mapping</h3>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500"><Zap size={12} fill="currentColor" /> INFERENCE_COMPLETE</div>
                       </div>

                       <div className="flex-1 bg-card-bg p-6 rounded-2xl border border-brand-primary/20 shadow-xl shadow-brand-primary/5 text-sm leading-relaxed text-text-primary relative z-10">
                          <p>
                             "Device (Serial: 
                             <span className="bg-brand-primary/10 text-brand-primary px-1 rounded font-bold">TS-992</span>) 
                             reported with 
                             <span className="bg-brand-primary/10 text-brand-primary px-1 rounded font-bold">Hardware Failure</span>. 
                             Physical indicator: 
                             <span className="bg-rose-500/10 text-rose-600 px-1 rounded font-bold italic underline decoration-rose-500/30">Liquid Leakage</span> 
                             from bezel. Olfactory observation: 
                             <span className="bg-amber-500/10 text-amber-700 px-1 rounded font-bold">Ozone-like Odor</span>. 
                             Awaiting PII-verified agent review."
                          </p>
                       </div>

                       <div className="pt-4 space-y-4 relative z-10">
                          <label className="text-tiny font-black text-text-muted uppercase">Entity Accuracy Mapping</label>
                          <div className="flex flex-wrap gap-2">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-text-secondary">Serial No:</span>
                                <ConfidenceMarker score={0.99} />
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-text-secondary">Incident Type:</span>
                                <ConfidenceMarker score={0.92} />
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-text-secondary">Symptom Log:</span>
                                <ConfidenceMarker score={0.88} />
                             </div>
                          </div>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Extraction Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="card space-y-6">
                    <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/30">
                       <ArrowRightLeft size={18} className="text-brand-primary" />
                       <h3 className="text-sm font-bold uppercase tracking-tight">Cross-Reference Search</h3>
                    </div>
                    <div className="pt-4 space-y-4">
                       <div className="p-4 bg-app-bg rounded-2xl border border-border-subtle flex justify-between items-center group cursor-pointer hover:border-brand-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-card-bg border border-border-subtle rounded-lg text-text-muted group-hover:text-brand-primary transition-colors"><FileSearch size={18} /></div>
                             <div>
                                <p className="text-xs font-bold">Prior Case Match [84%]</p>
                                <p className="text-[10px] text-text-muted">CMP-721: "Smell of burning ozone"</p>
                             </div>
                          </div>
                          <ChevronRight size={14} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                 </div>
                 <div className="card space-y-6">
                    <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/30">
                       <ShieldCheck size={18} className="text-emerald-500" />
                       <h3 className="text-sm font-bold uppercase tracking-tight">PII Protection Audit</h3>
                    </div>
                    <div className="pt-4 space-y-2">
                       <label className="text-tiny flex justify-between"><span>Scrubbing Ratio</span><span>100% Secure</span></label>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-subtle">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            className="h-full bg-emerald-500 shadow-[0_0_10px_var(--success)]" 
                          />
                       </div>
                       <p className="text-[10px] text-text-muted font-bold tracking-tight pt-2 italic">
                          Names and internal handles identified and tokenized per Vault protocol.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Ingress Sidebar (4 cols) */}
           <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="card space-y-6">
                 <div className="flex items-center gap-3">
                    <FileSearch size={18} className="text-brand-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-tight">Parser Diagnostic</h3>
                 </div>
                 <div className="space-y-4 pt-2">
                    {[
                      { l: 'Token Lattice Depth', v: 'L8', i: CheckCircle2, c: 'text-emerald-500' },
                      { l: 'Neural Latency', v: '412ms', i: CheckCircle2, c: 'text-emerald-500' },
                      { l: 'Redundancy Check', v: 'Passed', i: CheckCircle2, c: 'text-emerald-500' },
                      { l: 'Contextual Ambiguity', v: 'Low', i: AlertCircle, c: 'text-brand-primary' },
                    ].map(s => (
                       <div key={s.l} className="flex justify-between items-center p-3 bg-app-bg border border-border-subtle rounded-xl">
                          <span className="text-xs font-bold text-text-secondary">{s.l}</span>
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-text-primary px-2 font-mono">{s.v}</span>
                             <s.i size={14} className={s.c} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="card bg-slate-900 border-slate-700 text-slate-300 p-6 space-y-4 shadow-2xl">
                 <div className="flex items-center gap-3 text-brand-primary">
                    <Zap size={18} fill="currentColor" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Inference Strategy</h4>
                 </div>
                 <p className="text-[11px] leading-relaxed font-mono opacity-80">
                    SET Strategy = "RECONSTRUCT_ENTITIES"
                    SET Temp = 0.2
                    SET Top_P = 0.95
                    RUN IngressMapping(Payload) &gt; Success_Score: 0.9882
                 </p>
                 <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-1.5 bg-slate-800 rounded border border-slate-700 text-[9px] font-black hover:bg-slate-700 transition-all uppercase">Source Map</button>
                    <button className="flex-1 py-1.5 bg-brand-primary text-white rounded text-[9px] font-black hover:bg-brand-hover transition-all uppercase">Logic Trace</button>
                 </div>
              </div>

              <div className="card text-center space-y-4 border-dashed border-2 bg-rose-500/5 border-rose-500/20 group cursor-pointer hover:bg-rose-500/10 transition-all">
                 <div className="p-3 bg-rose-500 text-white rounded-full w-fit mx-auto group-hover:scale-110 transition-transform"><Trash2 size={24} /></div>
                 <div>
                    <h4 className="font-bold text-rose-600">Manual Override</h4>
                    <p className="text-[10px] text-text-muted font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                       Neural reconstruction does not match expectations? Return to raw editor for manual data entry.
                    </p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default EmailExtractor;
