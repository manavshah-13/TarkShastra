import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
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
  SkipForward,
  Loader2,
  ArrowRight,
  ArrowLeft
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

const ClassificationReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [complaints, setComplaints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justification, setJustification] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDiff, setShowDiff] = useState(true);

  const commonReasons = [
    'Ambiguous Intent',
    'Category Misaligned',
    'Contextual Nuance Missing',
    'Urgency Reassessment',
    'Customer History Conflict'
  ];

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const fetchReviewQueue = async () => {
    setLoading(true);
    try {
      // Fetch complaints that need QA review (have overrides)
      const data = await api.get('/complaints?status=CLASSIFIED&limit=20');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch review queue', err);
      // Mock data for demo
      setComplaints([
        { id: 1, title: 'Device arrived with cracked screen', category: 'Hardware', priority: 'P1', ai_confidence: 0.65, override_category: 'Safety', override_priority: 'P0', override_reason: 'Burning smell mentioned', description: 'The device arrived with a cracked screen. More importantly, it appears to be leaking through the bezel.' },
        { id: 2, title: 'Billing discrepancy in invoice', category: 'Billing', priority: 'P2', ai_confidence: 0.82, override_category: null, override_priority: null, description: 'Invoice shows incorrect charges for Q4 services.' },
        { id: 3, title: 'Service request pending', category: 'Service', priority: 'P1', ai_confidence: 0.91, override_category: null, override_priority: null, description: 'Customer has been waiting 3 weeks for response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentComplaint = complaints[currentIndex];

  const handleVerdict = async (verdict) => {
    if (!currentComplaint) return;
    
    if (verdict === 'ai_correct' && justification.length < 20) {
      alert('Please provide justification (min 20 characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      // In real app, POST to /qa/verdict
      console.log('Submitting verdict:', { complaintId: currentComplaint.id, verdict, justification, tags: selectedTags });
      
      // Move to next
      if (currentIndex < complaints.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setJustification('');
        setSelectedTags([]);
      } else {
        navigate('/qa');
      }
    } catch (err) {
      console.error('Failed to submit verdict', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (currentIndex < complaints.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setJustification('');
      setSelectedTags([]);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <AppLayout activePage="QA">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-brand-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!currentComplaint) {
    return (
      <AppLayout activePage="QA">
        <div className="text-center py-12">
          <Check size={48} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary">No Reviews Pending</h2>
          <p className="text-text-muted mt-2">All complaints have been reviewed.</p>
          <button onClick={() => navigate('/qa')} className="btn-primary mt-4">
            Back to QA Dashboard
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activePage="QA">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 hover:bg-card-bg border border-border-subtle rounded-lg text-text-muted disabled:opacity-30">
               <ChevronLeft size={20} />
            </button>
            <div className="space-y-1">
              <p className="text-tiny">TarkShastra Annotation Protocol</p>
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-bold text-text-primary">Reviewing Case CMP-{currentComplaint.id}</h2>
                 <span className="text-[10px] bg-app-bg text-text-muted font-bold px-2 py-1 rounded border border-border-subtle">{currentIndex + 1} of {complaints.length} in Queue</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button onClick={handleSkip} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary flex items-center gap-2 border border-border-subtle rounded-lg">
                <SkipForward size={18} />
                Skip
             </button>
             <button 
               onClick={() => handleVerdict('ai_correct')} 
               disabled={isSubmitting || (justification.length < 20 && currentComplaint.override_category)}
               className="btn-primary flex items-center gap-2 px-8 disabled:opacity-50"
             >
               {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
               Confirm Verdict
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">AI Prediction</span>
                   </div>
                   <div className="p-8 space-y-6 flex-1">
                      <div className="space-y-2">
                         <p className="text-tiny">Category</p>
                         <div className="text-lg font-bold text-rose-600">{currentComplaint.category}</div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-tiny">Priority</p>
                         <div className="text-sm font-semibold text-text-primary">{currentComplaint.priority}</div>
                      </div>
                      <div className="pt-6 border-t border-border-subtle">
                         <p className="text-tiny mb-2">Confidence</p>
                         <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                           <div className="h-full bg-rose-500" style={{ width: `${(currentComplaint.ai_confidence || 0.5) * 100}%` }} />
                         </div>
                         <p className="text-[10px] text-text-muted mt-1">{Math.round((currentComplaint.ai_confidence || 0.5) * 100)}%</p>
                      </div>
                   </div>
                </div>

                {/* Override / Correction */}
                <div className="flex flex-col bg-emerald-500/5">
                   <div className="p-4 border-b border-border-subtle flex items-center gap-3">
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Executive Override</span>
                   </div>
                   <div className="p-8 space-y-6 flex-1">
                      <div className="space-y-2">
                         <p className="text-tiny">Category</p>
                         <div className="flex items-center gap-2">
                            {currentComplaint.override_category ? (
                              <>
                                <span className="text-lg font-bold text-emerald-600">{currentComplaint.override_category}</span>
                                <DiffText type="del">{currentComplaint.category}</DiffText>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-text-muted">No Change</span>
                            )}
                         </div>
                      </div>
                      <div className="space-y-2">
                         <p className="text-tiny">Priority</p>
                         <div className="flex items-center gap-2 text-text-primary">
                            {currentComplaint.override_priority ? (
                              <>
                                <span className="font-semibold">{currentComplaint.override_priority}</span>
                                <DiffText type="del">{currentComplaint.priority}</DiffText>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-text-muted">No Change</span>
                            )}
                         </div>
                      </div>
                      {currentComplaint.override_reason && (
                        <div className="pt-6 border-t border-border-subtle">
                           <p className="text-tiny mb-2">Override Reason</p>
                           <div className="text-xs italic text-text-secondary leading-relaxed">
                             {currentComplaint.override_reason}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             {/* Complaint Text */}
             <div className="card space-y-6">
                <div className="flex items-center justify-between border-b border-border-subtle -m-6 p-4 mb-2 bg-app-bg/50">
                   <div className="flex items-center gap-3">
                      <MessageSquare size={16} className="text-text-muted" />
                      <h3 className="text-sm font-bold tracking-tight">Complaint Content</h3>
                   </div>
                   <button 
                     onClick={() => navigate(`/complaint/${currentComplaint.id}`)}
                     className="text-[10px] font-bold text-brand-primary hover:underline"
                   >
                     View Full Details →
                   </button>
                </div>
                <div className="pt-4 font-mono text-sm leading-relaxed p-6 bg-app-bg rounded-xl border border-border-subtle">
                   {currentComplaint.description || currentComplaint.title}
                </div>
             </div>
          </div>

          {/* Verdict Sidebar (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
             <div className="card space-y-6">
                <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">QA Verdict</h3>
                
                {/* Verdict Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => handleVerdict('ai_correct')}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Check size={18} />
                    AI Was Correct
                  </button>
                  
                  <button 
                    onClick={() => handleVerdict('ai_wrong')}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                  >
                    <X size={18} />
                    AI Was Wrong
                  </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-border-subtle">
                   <label className="text-tiny">Justification (Required for overrides)</label>
                   <textarea 
                     value={justification}
                     onChange={(e) => setJustification(e.target.value)}
                     placeholder="Why is this verdict necessary? (Min 20 chars for overrides)"
                     className={`input-field min-h-[120px] resize-none ${justification.length > 0 && justification.length < 20 ? 'border-amber-500' : ''}`}
                   />
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className={justification.length >= 20 ? 'text-emerald-500' : 'text-text-muted'}>
                        {justification.length} chars
                      </span>
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
                   Your verdict affects model training. "AI Was Wrong" flags this case for retraining dataset.
                </p>
             </div>

             {/* Navigation */}
             <div className="flex justify-between">
               <button 
                 onClick={handlePrev}
                 disabled={currentIndex === 0}
                 className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary disabled:opacity-30"
               >
                 <ArrowLeft size={16} /> Previous
               </button>
               <button 
                 onClick={handleSkip}
                 disabled={currentIndex >= complaints.length - 1}
                 className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary disabled:opacity-30"
               >
                 Next <ArrowRight size={16} />
               </button>
             </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ClassificationReview;
