import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  Save,
  SkipForward
} from 'lucide-react';

const DiffText = ({ type, children }) => {
  const styles = type === 'del' 
    ? 'bg-red-500/10 text-rose-600 line-through decoration-rose-600/50' 
    : 'bg-emerald-500/10 text-emerald-600';
  
  return (
    <span className={`px-1 rounded-sm font-semibold ${styles}`}>
      {children}
    </span>
  );
};

const ClassificationReview = ({ onNext, onPrev }) => {
  const [justification, setJustification] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const commonReasons = [
    'Ambiguous Intent',
    'Category Misaligned',
    'Contextual Nuance Missing',
    'Urgency Reassessment',
    'Customer History Conflict'
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
  };

  return (
    <AppLayout activePage="Complaints">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={onPrev} className="p-2 hover:bg-card-bg border border-border-subtle rounded-lg text-text-muted">
               <ChevronLeft size={20} />
            </button>
            <div className="space-y-1">
              <p className="text-tiny">TarkShastra Annotation Protocol</p>
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-bold text-text-primary">Reviewing Case CMP-821</h2>
                 <span className="text-[10px] bg-app-bg text-text-muted font-bold px-2 py-1 rounded border border-border-subtle">45 of 123 in Batch</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary flex items-center gap-2">
                <SkipForward size={18} />
                Skip Item
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2 px-8">
                Confirm Verdict
                <Check size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Comparison Panels (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-subtle rounded-2xl overflow-hidden bg-card-bg shadow-lg">
                
                {/* AI Prediction */}
                <div className="flex flex-col border-r border-border-subtle">
                   <div className="p-4 bg-rose-500/5 border-b border-border-subtle flex items-center gap-3">
                      <ShieldAlert size={16} className="text-rose-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">AI Original Prediction</span>
                   </div>
                   <div className="p-8 space-y-6 flex-1">
                      <div className="space-y-2">
                         <p className="text-tiny">Category</p>
                         <div className="text-lg font-bold text-rose-600">Hardware Failure</div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-tiny">Priority</p>
                         <div className="text-sm font-semibold text-text-primary">High (P1)</div>
                      </div>
                      <div className="pt-6 border-t border-border-subtle">
                         <p className="text-tiny mb-2">Confidence Trace</p>
                         <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                           <div className="h-full bg-rose-500 w-[65%]" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Human Correction */}
                <div className="flex flex-col bg-emerald-500/5">
                   <div className="p-4 border-b border-border-subtle flex items-center gap-3">
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Human Correction Required</span>
                   </div>
                   <div className="p-8 space-y-6 flex-1">
                      <div className="space-y-2">
                         <p className="text-tiny">Revised Category</p>
                         <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-600">Safety Hazard</span>
                            <DiffText type="add">High Risk</DiffText>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-tiny">Revised Priority</p>
                         <div className="text-sm font-semibold flex items-center gap-2 text-text-primary">
                           Critical (P0)
                           <DiffText type="del">P1</DiffText>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-border-subtle">
                         <p className="text-tiny mb-2">Impact Assessment</p>
                         <div className="text-xs italic text-text-secondary leading-relaxed">
                            Requires immediate floor manager notification as per 
                            <DiffText type="add">Protocol-V</DiffText> safety standards.
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Text View with Highlights */}
             <div className="card space-y-6">
                <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-4 mb-2 bg-app-bg/50">
                   <MessageSquare size={16} className="text-text-muted" />
                   <h3 className="text-sm font-bold tracking-tight">Complaint Content Analysis</h3>
                </div>
                <div className="pt-4 font-mono text-sm leading-relaxed p-6 bg-app-bg rounded-xl border border-border-subtle">
                   "The device (Serial: VC-992-X) arrived with a cracked screen. 
                   More importantly, the {" "}
                   <DiffText type="del">liquid smoke UI effect</DiffText> 
                   {" "} appears to be leaking 
                   through the physical bezel. This is causing a 
                   {" "}
                   <DiffText type="add">DISTINCT BURNING SMELL</DiffText>
                   . I request an immediate replacement..."
                </div>
             </div>
          </div>

          {/* Justification Sidebar (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
             <div className="card space-y-6">
                <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Correction Rationale</h3>
                
                <div className="space-y-4">
                   <label className="text-tiny">Required Justification</label>
                   <textarea 
                     value={justification}
                     onChange={(e) => setJustification(e.target.value)}
                     placeholder="Why is this AI override necessary? (Min 20 chars)"
                     className={`input-field min-h-[160px] resize-none ${justification.length < 20 && justification.length > 0 ? 'border-amber-500 focus:ring-amber-500/20' : ''}`}
                   />
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className={justification.length >= 20 ? 'text-emerald-500' : 'text-amber-500'}>
                        {justification.length < 20 ? 'Min 20 characters required' : 'Validation passed'}
                      </span>
                      <span className="text-text-muted">{justification.length} chars</span>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-tiny">Quick Tags</label>
                   <div className="flex flex-wrap gap-2">
                      {commonReasons.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
                            selectedTags.includes(tag) 
                              ? 'bg-brand-primary border-brand-primary text-white shadow-md' 
                              : 'bg-app-bg border-border-subtle text-text-muted hover:border-brand-primary hover:text-brand-primary'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="card bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                   <AlertCircle size={18} />
                   <h4 className="text-sm font-bold tracking-tight uppercase">Quality Impact</h4>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                   Overriding AI classifications impacts the underlying model training via RLHF. 
                   Ensure accuracy before submitting this verdict.
                </p>
             </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ClassificationReview;
