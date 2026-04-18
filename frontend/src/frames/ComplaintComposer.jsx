import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import QuillEditor from '../components/QuillEditor';
import { 
  Send, 
  Trash2, 
  Paperclip, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  History,
  ChevronRight,
  User,
  Hash
} from 'lucide-react';

const ComplaintComposer = ({ onNext }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <AppLayout activePage="New Complaint">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Case Creation Studio</h1>
            <p className="text-text-secondary">Draft new ledger entries with real-time neural assistance</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                <Trash2 size={16} />
                Purge Draft
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2 group">
                <Send size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                Commit to Ledger
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Editor (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="card space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 pb-2 border-b border-border-subtle">
                      <Hash size={18} className="text-text-muted" />
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Case Subject Header (e.g. Hardware failure at Region 4...)"
                        className="flex-1 bg-transparent text-xl font-bold border-none outline-none placeholder:text-text-muted text-text-primary"
                      />
                   </div>
                   
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <User size={14} className="text-text-muted" />
                         <span className="text-xs font-semibold text-text-primary">Assigned: Alex Rivera</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-500" />
                         <span className="text-xs font-semibold text-text-primary">Sovereign Encryption: Active</span>
                      </div>
                   </div>
                </div>

                <div className="h-[500px] flex flex-col">
                   <QuillEditor 
                     value={content} 
                     onChange={setContent} 
                     modules={modules}
                     className="flex-1 rounded-xl overflow-hidden" 
                     placeholder="Detailed event log, evidence descriptions, and required remedial actions..."
                   />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
                   <button className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-semibold cursor-pointer">
                      <Paperclip size={18} />
                      Attach Evidence (Max 50MB per artifact)
                   </button>
                   <div className="flex gap-4">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Word Count: {content.replace(/<[^>]*>/g, '').split(' ').filter(x => x).length}</span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Status: Syncing...</span>
                   </div>
                </div>
             </div>
          </div>

          {/* AI Assistance Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
             <div className="card bg-brand-primary text-white space-y-4 border-none shadow-xl shadow-brand-primary/20 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-lg"><Sparkles size={20} /></div>
                   <h3 className="font-bold tracking-tight">Neural Drafting Core</h3>
                </div>
                <p className="relative z-10 text-sm leading-relaxed opacity-90">
                   Our language models can help refine your complaint's tone or generate summaries based on your draft.
                </p>
                <div className="relative z-10 grid grid-cols-2 gap-2 pt-2">
                   <button className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                      <Zap size={14} />
                      AUTO-REFINE
                   </button>
                   <button className="px-3 py-2 bg-white text-brand-primary hover:bg-white/90 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                      GENERATE TL;DR
                   </button>
                </div>
             </div>

             <div className="card space-y-6">
                <div className="flex items-center gap-3">
                   <History size={18} className="text-brand-primary" />
                   <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Draft Timeline</h3>
                </div>
                <div className="space-y-4">
                   {[1, 2].map((i) => (
                     <div key={i} className="flex gap-4 group cursor-pointer">
                        <div className="w-1 h-10 bg-border-subtle rounded-full group-hover:bg-brand-primary transition-colors" />
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-text-primary">Revision v1.{i}</p>
                           <p className="text-[10px] text-text-muted">Mar 12, 10:45 AM • Auto-saved</p>
                        </div>
                        <ChevronRight size={14} className="text-text-muted self-center group-hover:text-brand-primary transition-all" />
                     </div>
                   ))}
                </div>
             </div>

             <div className="card bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                   <ShieldCheck size={18} />
                   <h4 className="text-xs font-bold uppercase tracking-widest">Protocol V Reminder</h4>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed italic">
                   Ensure no personally identifiable data (PID) is included unless processed through the PII-Redactor module.
                </p>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ComplaintComposer;
