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
      const data = await api.get('/complaints?status=new&limit=20');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch review queue', err);
      setComplaints([
        { id: 1, title: 'Device arrived with cracked screen', category: 'Hardware', priority: 'medium', ai_confidence: 0.65, override_category: 'Safety', override_priority: 'urgent', override_reason: 'Burning smell mentioned', description: 'The device arrived with a cracked screen. More importantly, it appears to be leaking through the bezel.' },
        { id: 2, title: 'Billing discrepancy in invoice', category: 'Billing', priority: 'low', ai_confidence: 0.82, override_category: null, override_priority: null, description: 'Invoice shows incorrect charges for Q4 services.' },
        { id: 3, title: 'Service request pending', category: 'Service', priority: 'high', ai_confidence: 0.91, override_category: null, override_priority: null, description: 'Customer has been waiting 3 weeks for response.' },
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
      console.log('Submitting verdict:', { complaintId: currentComplaint.id, verdict, justification, tags: selectedTags });
      
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
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-brand-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!currentComplaint) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary">No Cases to Review</h2>
          <p className="text-text-muted mt-2">All complaints have been classified.</p>
          <button onClick={() => navigate('/qa')} className="btn-primary mt-4">Back to QA Dashboard</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="card space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle -m-6 p-6 bg-app-bg/50">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={20} className="text-brand-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Case Manifesto</h3>
                </div>
                <button onClick={() => setShowDiff(!showDiff)} className="text-[10px] font-black text-brand-primary uppercase">
                  {showDiff ? 'Hide' : 'Show'} Diff
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">AI Classification</p>
                  <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
                    <p className="text-xs font-bold text-text-primary mb-2">{currentComplaint.category}</p>
                    <p className="text-[10px] text-text-muted">Priority: {currentComplaint.priority?.toUpperCase()}</p>
                    <p className="text-[10px] text-text-muted">Confidence: {Math.round(currentComplaint.ai_confidence * 100)}%</p>
                  </div>
                </div>
                
                {currentComplaint.override_category && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Human Override</p>
                    <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                      <p className="text-xs font-bold text-text-primary mb-2">{currentComplaint.override_category}</p>
                      <p className="text-[10px] text-text-muted">Priority: {currentComplaint.override_priority?.toUpperCase()}</p>
                      <p className="text-[10px] text-rose-500 mt-2 italic">"{currentComplaint.override_reason}"</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Description</p>
                <p className="text-sm text-text-secondary leading-relaxed">{currentComplaint.description}</p>
              </div>
            </div>

            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-brand-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Verdict Justification</h3>
              </div>
              
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Provide reasoning for your verdict..."
                className="w-full h-32 bg-card-bg border border-border-subtle rounded-xl p-4 text-sm focus:outline-none focus:border-brand-primary"
              />
              
              <div className="flex flex-wrap gap-2">
                {commonReasons.map(reason => (
                  <button
                    key={reason}
                    onClick={() => toggleTag(reason)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border transition-all ${
                      selectedTags.includes(reason) 
                        ? 'bg-brand-primary text-white border-brand-primary' 
                        : 'bg-card-bg text-text-muted border-border-subtle hover:border-brand-primary'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="card space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Quick Actions</h3>
              
              <button onClick={() => handleVerdict('ai_correct')} className="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                <Check size={18} />
                Approve AI Verdict
              </button>
              
              <button onClick={() => handleVerdict('human_override')} className="w-full py-3 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
                <X size={18} />
                Reject & Override
              </button>
              
              <button onClick={handleSkip} className="w-full py-3 bg-card-bg border border-border-subtle rounded-xl text-xs font-bold uppercase hover:border-brand-primary transition-all flex items-center justify-center gap-2">
                <SkipForward size={18} />
                Skip for Now
              </button>
            </div>

            <div className="card space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Queue Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Reviewed</span>
                  <span className="font-bold text-text-primary">{currentIndex}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Remaining</span>
                  <span className="font-bold text-text-primary">{complaints.length - currentIndex - 1}</span>
                </div>
                <div className="w-full h-2 bg-card-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary transition-all"
                    style={{ width: `${((currentIndex + 1) / complaints.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClassificationReview;