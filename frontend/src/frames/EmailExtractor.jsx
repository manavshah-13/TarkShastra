import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Fingerprint,
  Inbox,
  ArrowRight,
  User,
  Hash
} from 'lucide-react';

const ConfidenceMarker = ({ score }) => {
  const isHigh = score > 0.9;
  return (
    <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/50 rounded-xl border border-white/5 group hover:border-brand-primary/30 transition-all">
       <div className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-emerald-500 shadow-[0_0_8px_var(--success)]' : 'bg-amber-500 shadow-[0_0_8px_var(--warning)]'}`} />
       <span className="text-[10px] font-mono font-black text-text-muted">{Math.round(score * 100)}%</span>
    </div>
  );
};

const EmailExtractor = () => {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingEmails = [
    { id: 1, from: 'alex.r@corp.com', subject: 'CMP-821 - Screen Issue', date: '10:44 AM' },
    { id: 2, from: 'sarah.smith@vault.io', subject: 'Node TS-8 Thermal Alert', date: '09:12 AM' },
    { id: 3, from: 'sys.admin@internal.node', subject: 'Batch Sync Failure CMP-992', date: '08:05 AM' },
  ];

  const handleCommit = () => {
    setIsProcessing(true);
    setTimeout(() => {
       setIsProcessing(false);
       navigate('/complaints', { state: { toast: 'Neural Extraction Committed to Case Ledger' } });
    }, 1500);
  };

  return (
    <div className="max-w-[1700px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra Neural Parser</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Email Intelligence Reconstruction</h1>
             <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                   <Zap size={10} className="text-brand-primary" fill="currentColor" />
                   <span className="text-[9px] font-black text-brand-primary uppercase">Engine: Sentinel_v8</span>
                </div>
                <span className="text-[10px] text-text-muted font-bold flex items-center gap-1.5"><Fingerprint size={12} /> AUTH_SHA: 8812B-X9</span>
             </div>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-3 px-6 py-3 border border-border-subtle rounded-2xl text-[10px] font-black uppercase text-text-muted hover:border-brand-primary hover:text-white transition-all shadow-sm">
                <RefreshCcw size={16} />
                Refresh Inbox
             </button>
             <button onClick={handleCommit} disabled={isProcessing} className="btn-primary flex items-center gap-4 px-10 relative overflow-hidden h-12 shadow-2xl shadow-brand-primary/30">
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Commit Extraction <ArrowRight size={18} />
                  </>
                )}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           
           {/* Sidebar Selection (3 cols) */}
           <div className="col-span-12 lg:col-span-3 space-y-6">
              <div className="card space-y-6">
                 <div className="flex items-center gap-3">
                    <Inbox size={20} className="text-brand-primary" />
                    <h3 className="text-sm font-black tracking-widest uppercase">Target Inbox</h3>
                 </div>
                 <div className="space-y-3">
                    {pendingEmails.map((email, idx) => (
                      <button 
                        key={email.id}
                        onClick={() => setSelectedEmail(idx)}
                        className={`w-full p-5 text-left rounded-3xl transition-all border group relative overflow-hidden ${
                          selectedEmail === idx ? 'bg-brand-primary/5 border-brand-primary shadow-xl shadow-brand-primary/10' : 'bg-app-bg border-border-subtle hover:border-brand-primary/30'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <p className={`text-[10px] font-black tracking-widest uppercase ${selectedEmail === idx ? 'text-brand-primary' : 'text-text-muted'}`}>{email.date}</p>
                            <Mail size={14} className={selectedEmail === idx ? 'text-brand-primary' : 'text-text-muted opacity-40'} />
                         </div>
                         <h4 className="text-xs font-extrabold text-text-primary mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">{email.subject}</h4>
                         <p className="text-[10px] text-text-muted font-medium truncate italic">{email.from}</p>
                         
                         {selectedEmail === idx && (
                           <motion.div layoutId="active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-r-full" />
                         )}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="card space-y-6 !bg-slate-900">
                 <div className="flex items-center gap-3 text-brand-primary">
                    <Zap size={18} fill="currentColor" />
                    <h3 className="text-xs font-black tracking-widest uppercase italic">Inference Engine</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 bg-black/20 rounded-2xl border border-white/5 font-mono text-[10px] space-y-2 leading-relaxed opacity-80">
                       <p className="text-emerald-500 underline uppercase">Status: Nominal</p>
                       <p className="text-slate-400">Temp: 0.12</p>
                       <p className="text-slate-400">Tokens/s: 142.4</p>
                       <p className="text-slate-400">Context: 8192kb</p>
                    </div>
                    <button className="w-full py-3 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-[9px] font-black uppercase text-brand-primary hover:bg-brand-primary hover:text-white transition-all">Adjust Neural Weights</button>
                 </div>
              </div>
           </div>

           {/* Comparative Workbench (9 cols) */}
           <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
              <div className="card !p-0 overflow-hidden border-2 border-slate-800 shadow-2xl relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                    <div className="p-4 bg-brand-primary rounded-full shadow-2xl text-white border-4 border-slate-900">
                       <ArrowRightLeft size={24} />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Input Pane */}
                    <div className="p-10 space-y-8 bg-slate-950/20 border-r border-slate-800">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 shadow-xl"><Mail size={22} /></div>
                             <div>
                                <h3 className="text-sm font-black tracking-widest uppercase">Raw Ingress Source</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">SHA-256 Verified Payload</p>
                             </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-900 px-3 py-1 rounded-full border border-white/5">0x81FA...22B</span>
                       </div>

                       <div className="p-8 bg-slate-900/50 rounded-[40px] border border-white/5 font-mono text-xs leading-relaxed text-slate-400 min-h-[400px] shadow-inner relative group select-all">
                          {"Subject: Re: Fwd: CMP-821 - Screen Issue\n\nDear Team,\n\nI'm writing to report that our device (Serial #TS-992) is essentially toast. There is a weird liquid leaking from the bezel. It smells like ozone? \n\nI had Sarah check it but she was confused. Pls help.\n\nBest,\nAlex R."}
                       </div>
                       
                       <div className="flex items-center gap-6 pt-4 grayscale opacity-40">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-500" /><span className="text-tiny font-black uppercase">Source Match</span></div>
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-500" /><span className="text-tiny font-black uppercase">No PII Leak</span></div>
                       </div>
                    </div>

                    {/* Output Pane */}
                    <div className="p-10 space-y-8 bg-brand-primary/[0.02] relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4 text-brand-primary">
                             <div className="p-3 bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/30 group-hover:rotate-12 transition-transform"><Cpu size={22} /></div>
                             <div>
                                <h3 className="text-sm font-black tracking-widest uppercase">Neural Reconstruction</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <Zap size={10} fill="currentColor" className="text-emerald-500" />
                                   <p className="text-[10px] font-black text-emerald-500 uppercase">Inference_Complete_L8</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-slate-900/80 rounded-[40px] border border-brand-primary/20 shadow-2xl text-base leading-relaxed text-slate-200 relative z-10 min-h-[400px]">
                          <p className="font-medium">
                             "Individual identified as <span className="text-brand-primary font-black underline decoration-2 underline-offset-4 decoration-brand-primary/30">Alex R.</span> reported critical failure of unit <span className="bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-lg font-black border border-brand-primary/10">TS-992</span>. 
                             <br /><br />
                             Physical observation includes 
                             <span className="text-rose-500 font-bold bg-rose-500/10 px-1 rounded">anomalous liquid discharge</span> 
                             from the chassis perimeter and secondary 
                             <span className="text-amber-500 font-bold bg-amber-500/10 px-1 rounded italic">ozone olfactory detection</span>. 
                             <br /><br />
                             Case categorized as <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-xl font-black border border-emerald-500/20">P0-Hardware-Breach</span>. 
                             Recommended move to diagnostic isolation node."
                          </p>
                       </div>

                       <div className="pt-4 space-y-4 relative z-10">
                          <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1">Confidence Metrics</label>
                          <div className="flex flex-wrap gap-4">
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2"><User size={12} className="text-brand-primary" /> Identity</span>
                                <ConfidenceMarker score={0.99} />
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2"><Hash size={12} className="text-brand-primary" /> Serial_ID</span>
                                <ConfidenceMarker score={0.94} />
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2"><AlertCircle size={12} className="text-brand-primary" /> Incident_Type</span>
                                <ConfidenceMarker score={0.88} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="card space-y-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary transition-colors">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-brand-primary">
                          <ShieldCheck size={20} />
                          <h3 className="text-sm font-black tracking-widest uppercase">PII Anonymization</h3>
                       </div>
                       <p className="text-xs text-text-muted leading-relaxed font-medium">
                          All personal identifiers have been tokenized before persistent committal. Sovereign identities are stored in <strong>Vault-S6</strong> only.
                       </p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                       <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_var(--success)]" transition={{ duration: 1 }} />
                    </div>
                 </div>

                 <div className="card space-y-8 !bg-[#0F172A]/40 border-dashed group cursor-pointer hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3 text-amber-500">
                       <AlertCircle size={20} />
                       <h3 className="text-sm font-black tracking-widest uppercase">Manual Oversight</h3>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed font-medium">
                       Does the neural reconstruction differ from the source? Activate manual override to define the case schema yourself.
                    </p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-amber-500 group-hover:translate-x-1 transition-transform uppercase">
                       Engage Manual Intervention <ArrowRight size={12} />
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
  );
};

export default EmailExtractor;
