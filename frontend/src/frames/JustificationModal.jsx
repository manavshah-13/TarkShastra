import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Fingerprint,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';

const JustificationModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetId, changeType, oldValue, newValue } = location.state || {
    targetId: 'CMP-892',
    changeType: 'Priority',
    oldValue: 'High',
    newValue: 'Medium'
  };

  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (reason.length < 20 || !confirmed) return;
    
    setIsSubmitting(true);
    try {
      await api.post(`/complaints/${targetId}/override`, {
        reason,
        change_type: changeType,
        old_value: oldValue,
        new_value: newValue,
        manual_override: true
      });
      navigate(-1);
    } catch (err) {
       console.error('Audit committal failed', err);
    } finally {
       setIsSubmitting(false);
    }
  };

  const quickTags = [
    'Wrong Category',
    'Customer Escalated',
    'Context Missing',
    'Protocol Drift',
    'False Trigger',
    'Duplicate Node'
  ];

  const appendTag = (tag) => {
    setReason(prev => {
      const space = prev.length > 0 ? ' ' : '';
      return prev + space + tag + '.';
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8 relative overflow-hidden font-sans selection:bg-brand-primary selection:text-white">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-primary/10 rounded-full blur-[160px] opacity-40 animate-pulse" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#0F172A]/90 backdrop-blur-3xl border border-slate-700/50 rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/10">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-500/30">
                 <ShieldAlert size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tight">Authority Justification</h2>
                 <p className="text-[10px] font-black text-rose-500 tracking-[0.2em] uppercase mt-1">Sovereign Override Protocol active</p>
              </div>
           </div>
           <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all">
              <X size={20} />
           </button>
        </div>

        {/* Modal Content */}
        <div className="p-10 space-y-10">
           {/* Context Display */}
           <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700/30 flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Context</p>
                 <p className="text-lg font-bold text-white uppercase">{changeType}: <span className="text-rose-500">{oldValue}</span> <ArrowRight className="inline mx-2 opacity-40" /> <span className="text-emerald-500">{newValue}</span></p>
              </div>
              <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 font-mono text-[10px] text-slate-400">
                 {targetId}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between text-tiny font-black text-slate-400 uppercase tracking-widest px-1">
                 <span>Operational Rationale</span>
                 <span className="flex items-center gap-1.5 text-brand-primary"><Lock size={12} /> SECURE LOGGING ENABLED</span>
              </div>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the clinical rationale for this manual ledger override..."
                className="w-full bg-slate-900/80 border-2 border-slate-700 rounded-3xl p-6 text-white text-lg font-medium placeholder:text-slate-600 focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all min-h-[160px] resize-none shadow-inner"
              />
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                 <span className={reason.length >= 20 ? 'text-emerald-500' : 'text-slate-500'}>
                    {reason.length < 20 ? `Min 20 characters required (${20 - reason.length} left)` : 'Validation Threshold Met'}
                 </span>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-slate-600 font-mono">Real-time Char Counter: {reason.length}</span>
                 </div>
              </div>
           </div>

           {/* Quick Tags */}
           <div className="space-y-4">
              <label className="text-tiny font-black text-slate-400 uppercase tracking-widest px-1">Classification Chips</label>
              <div className="flex flex-wrap gap-2.5">
                 {quickTags.map(tag => (
                   <button 
                     key={tag}
                     onClick={() => appendTag(tag)}
                     className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 text-slate-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                   >
                      {tag}
                   </button>
                 ))}
                 <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-700 text-slate-500 hover:border-slate-400 transition-all">+ Custom Tag</button>
              </div>
           </div>

           {/* Confirmation */}
           <div 
             onClick={() => setConfirmed(!confirmed)}
             className={`p-6 bg-slate-900/80 rounded-3xl border transition-all cursor-pointer flex items-center gap-5 ${confirmed ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700/50 hover:border-slate-600'}`}
           >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${confirmed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                 {confirmed && <CheckCircle2 size={16} className="text-white" />}
              </div>
              <div className="flex-1">
                 <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Acknowledge Audit Trail</p>
                 <p className="text-[10px] text-slate-500 leading-relaxed mt-1">I verify that this override conforms to TarkShastra Operational Code VII and will be persisted to the neural ledger for QA review.</p>
              </div>
           </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 pt-0 flex gap-4">
           <button 
             onClick={() => navigate(-1)}
             className="flex-1 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
           >
              Abort Operation
           </button>
           <button 
             onClick={handleConfirm}
             disabled={!confirmed || reason.length < 20 || isSubmitting}
             className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/30 enabled:hover:bg-brand-hover enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3"
           >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Finalize & Commit <Zap size={16} fill="white" /></>
              )}
           </button>
        </div>

        {/* Bottom Trace */}
        <div className="p-4 bg-slate-950/50 flex items-center justify-center gap-10 border-t border-slate-700/20 text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
           <span className="flex items-center gap-2"><Fingerprint size={12} /> Root_AR_88</span>
           <span className="flex items-center gap-2"><ShieldAlert size={12} className="text-rose-500" /> Audit Logged</span>
           <span className="flex items-center gap-2"><Zap size={12} className="text-brand-primary" /> Pulse_Synced</span>
        </div>
      </motion.div>
    </div>
  );
};

export default JustificationModal;
