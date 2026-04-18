import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
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
  Hash,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const ComplaintComposer = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const DRAFT_KEY = 'tarkshastra_complaint_draft';

  // Auto-save draft to localStorage every 10 seconds
  useEffect(() => {
    const saveDraft = () => {
      if (title || content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, timestamp: Date.now() }));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    };

    const interval = setInterval(saveDraft, 10000);
    return () => clearInterval(interval);
  }, [title, content]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.title) setTitle(draft.title);
        if (draft.content) setContent(draft.content);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!content || content.length < 10) {
      alert('Please enter at least 10 characters of description');
      return;
    }

    setIsSubmitting(true);
    try {
      const complaintData = {
        title: title || 'Untitled Complaint',
        description: content,
        channel: channel,
      };
      
      const result = await api.post('/complaints', complaintData);
      
      // Clear draft after successful submission
      localStorage.removeItem(DRAFT_KEY);
      
      // Navigate to AI Theater for review
      navigate(`/ai-review/${result.id}`);
    } catch (err) {
      console.error('Failed to create complaint', err);
      alert('Failed to create complaint: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurgeDraft = () => {
    if (confirm('Are you sure you want to purge this draft?')) {
      setTitle('');
      setContent('');
      localStorage.removeItem(DRAFT_KEY);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  const wordCount = content.replace(/<[^>]*>/g, '').split(' ').filter(x => x).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Case Creation Studio</h1>
            <p className="text-text-secondary">Draft new ledger entries with real-time neural assistance</p>
          </div>
          <div className="flex gap-3">
             <button onClick={handlePurgeDraft} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                <Trash2 size={16} />
                Purge Draft
             </button>
             <button 
               onClick={handleSubmit} 
               disabled={isSubmitting || wordCount < 10}
               className="btn-primary flex items-center gap-2 group disabled:opacity-50"
             >
               {isSubmitting ? (
                 <Loader2 size={16} className="animate-spin" />
               ) : (
                 <Send size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
               )}
               Analyze with AI
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
                         <span className="text-xs font-semibold text-text-primary">Channel:</span>
                         <select 
                           value={channel}
                           onChange={(e) => setChannel(e.target.value)}
                           className="bg-card-bg border border-border-subtle rounded px-2 py-1 text-xs font-semibold text-text-primary"
                         >
                           <option value="manual">Manual Entry</option>
                           <option value="email">Email</option>
                           <option value="phone">Phone</option>
                           <option value="chat">Live Chat</option>
                         </select>
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
                      {isSaved && (
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Draft saved
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-text-muted uppercase">Word Count: {wordCount}/5000</span>
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
                           <p className="text-[10px] text-text-muted">Auto-saved</p>
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
  );
}

export default ComplaintComposer
