import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  MessageSquare,
  Lock,
  Zap,
  Fingerprint
} from 'lucide-react';

const JustificationModal = ({ onNext, onPrev }) => {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const tags = [
    'Protocol Override',
    'False Positive',
    'Customer Escalation',
    'Batch Purge',
    'Neural Drift'
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden font-sans selection:bg-brand-primary selection:text-white">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-primary/10 rounded-full blur-[160px] opacity-40" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#0F172A]/80 backdrop-blur-3xl border border-slate-700/50 rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-500/20 animate-pulse">
                 <ShieldAlert size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tight">Authority Justification</h2>
                 <p className="text-[10px] font-black text-rose-500 tracking-[0.2em] uppercase mt-1">Sovereign Override Protocol active</p>
              </div>
           </div>
           <button onClick={onPrev} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all">
              <X size={20} />
           </button>
        </div>

        {/* Modal Content */}
        <div className="p-10 space-y-10">
           <div className="space-y-4">
              <div className="flex items-center justify-between text-tiny font-black text-slate-400 uppercase tracking-widest px-1">
                 <span>Operational Intent</span>
                 <span className="flex items-center gap-1.5 text-brand-primary"><Lock size={12} /> SECURE LOGGING ON</span>
              </div>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the clinical rationale for this manual ledger override..."
                className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-3xl p-6 text-white text-lg font-medium placeholder:text-slate-600 focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all min-h-[160px] resize-none shadow-inner"
              />
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                 <span className={reason.length >= 30 ? 'text-emerald-500' : 'text-slate-500'}>
                   {reason.length < 30 ? `Min 30 characters required (${30 - reason.length} left)` : 'Justification criteria met'}
                 </span>
                 <span className="text-slate-600 font-mono italic">Trace: UID_8829_AR</span>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-tiny font-black text-slate-400 uppercase tracking-widest px-1">Authority Classification Tags</label>
              <div className="flex flex-wrap gap-2.5">
                 {tags.map(tag => (
                   <button 
                     key={tag}
                     onClick={() => setConfirmed(!confirmed)}
                     className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700 text-slate-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                   >
                      {tag}
                   </button>
                 ))}
                 <button className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-700 text-slate-500 hover:border-slate-400 transition-all">+ Add Tag</button>
              </div>
           </div>

           <div className="p-6 bg-slate-900/80 rounded-3xl border border-slate-700/50 flex items-center gap-5 group cursor-pointer hover:border-emerald-500/30 transition-all">
              <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={confirmed}
                   onChange={(e) => setConfirmed(e.target.checked)}
                   className="w-6 h-6 rounded-lg border-2 border-slate-600 bg-slate-800 text-brand-primary focus:ring-brand-primary/20 appearance-none checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                 />
                 <CheckCircle2 size={16} className={`absolute inset-0 m-auto text-white pointer-events-none transition-transform ${confirmed ? 'scale-100' : 'scale-0'}`} />
              </div>
              <div className="flex-1">
                 <p className="text-xs font-bold text-slate-300">Acknowledge Immutable Committal</p>
                 <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">I verify that this override conforms to TarkShastra Operational Code VII and is being logged to the neural ledger.</p>
              </div>
           </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 pt-0 flex gap-4">
           <button 
             onClick={onPrev}
             className="flex-1 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
           >
              Cancel Operation
           </button>
           <button 
             onClick={onNext}
             disabled={!confirmed || reason.length < 30}
             className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/40 enabled:hover:bg-brand-hover enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3"
           >
              Finalize & Commit
              <Zap size={16} fill="white" />
           </button>
        </div>

        {/* Bottom Trace */}
        <div className="p-4 bg-slate-950/50 flex items-center justify-center gap-6 border-t border-slate-700/20 text-[9px] font-mono font-bold text-slate-600">
           <span className="flex items-center gap-2"><Fingerprint size={12} /> AUTH: AR_ROOT</span>
           <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> ENCRYPTION: SHA-512</span>
           <span className="flex items-center gap-2"><Zap size={12} className="text-brand-primary" /> LATENCY: 12ms</span>
        </div>
      </motion.div>
    </div>
  );
};

export default JustificationModal;
