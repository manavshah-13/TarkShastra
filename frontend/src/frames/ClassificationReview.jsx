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
  SkipForward,
  Loader2,
  ArrowUpRight,
  AlertTriangle,
  User,
  BarChart3
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

const CalibrationGauge = ({ score, label }) => {
  const rotation = (score / 100) * 180 - 90;
  
  return (
    <div className="relative w-32 h-16 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-rose-500 via-amber-500 to-emerald-500 rounded-t-full opacity-20" />
      <div 
        className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-brand-primary origin-bottom transition-transform duration-500"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-primary rounded-full" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-text-primary">{score}%</div>
    </div>
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
  const [similarCases, setSimilarCases] = useState([]);

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
      const data = await api.get('/complaints?limit=50');
      const lowConfidence = (data || []).filter(c => c.ai_confidence && c.ai_confidence < 0.85);
      const sorted = lowConfidence.sort((a, b) => (a.ai_confidence || 1) - (b.ai_confidence || 1));
      setComplaints(sorted.length > 0 ? sorted : data?.slice(0, 10) || []);
      setSimilarCases([
        { id: 101, title: 'Similar issue pattern 1', ai_confidence: 0.72 },
        { id: 102, title: 'Similar issue pattern 2', ai_confidence: 0.68 },
        { id: 103, title: 'Similar issue pattern 3', ai_confidence: 0.65 }
      ]);
    } catch (err) {
      console.error('Failed to fetch review queue', err);
      setComplaints([
        { id: 1, title: 'Device arrived with cracked screen', category: 'Hardware', priority: 'medium', ai_confidence: 0.65, description: 'The device arrived with a cracked screen.' },
        { id: 2, title: 'Billing discrepancy in invoice', category: 'Billing', priority: 'low', ai_confidence: 0.82, description: 'Invoice shows incorrect charges.' },
        { id: 3, title: 'Service request pending', category: 'Service', priority: 'high', ai_confidence: 0.91, description: 'Customer has been waiting.' },
      ]);
      setSimilarCases([
        { id: 101, title: 'Similar issue pattern 1', ai_confidence: 0.72 },
        { id: 102, title: 'Similar issue pattern 2', ai_confidence: 0.68 },
        { id: 103, title: 'Similar issue pattern 3', ai_confidence: 0.65 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCases = async (category, predicted) => {
    try {
      const data = await api.get(`/analytics/qa/confusion/${predicted}/${category}`);
      setSimilarCases(data || [
        { id: 101, title: 'Similar issue pattern 1', ai_confidence: 0.72 },
        { id: 102, title: 'Similar issue pattern 2', ai_confidence: 0.68 },
        { id: 103, title: 'Similar issue pattern 3', ai_confidence: 0.65 }
      ]);
    } catch (err) {
      setSimilarCases([
        { id: 101, title: 'Similar issue pattern 1', ai_confidence: 0.72 },
        { id: 102, title: 'Similar issue pattern 2', ai_confidence: 0.68 },
        { id: 103, title: 'Similar issue pattern 3', ai_confidence: 0.65 }
      ]);
    }
  };

  useEffect(() => {
    if (currentComplaint) {
      fetchSimilarCases(currentComplaint.category, currentComplaint.category);
    }
  }, [currentIndex, complaints]);

  const currentComplaint = complaints[currentIndex];

  const handleVerdict = async (verdict) => {
    if (!currentComplaint) return;
    
    if (verdict !== 'skip' && justification.length < 10) {
      alert('Please provide a brief justification (min 10 characters)');
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && !e.target.closest('textarea')) {
        handleVerdict('ai_correct');
      } else if (e.key === 'ArrowLeft' && !e.target.closest('textarea')) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [justification, currentIndex]);

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

  // Mock AI reasoning
  const aiReasons = [
    { term: 'damaged', weight: '+0.42' },
    { term: 'product', weight: '+0.18' },
    { term: 'broken', weight: '+0.12' }
  ];

  // Mock calibration data
  const calibrationData = [
    { user: 'analyst', overrides: 15, accuracy: 40 },
    { user: 'sarah_j', overrides: 8, accuracy: 72 },
    { user: 'marcus_t', overrides: 12, accuracy: 58 }
  ];

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 hover:bg-card-bg border border-border-subtle rounded-lg text-text-muted disabled:opacity-30">
              <ChevronLeft size={20} />
            </button>
            <div className="space-y-1">
              <p className="text-tiny">TarkShastra Truth Arbiter</p>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-text-primary">Reviewing Case CMP-{currentComplaint.id}</h2>
                <span className="text-[10px] bg-app-bg text-text-muted font-bold px-2 py-1 rounded border border-border-subtle">
                  {currentIndex + 1} of {complaints.length}
                </span>
                <span className="text-[10px] font-mono text-text-muted">← → for keyboard</span>
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
              disabled={isSubmitting || justification.length < 10}
              className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              Confirm Verdict
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* A. Side-by-Side Comparison */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between border-b border-border-subtle -mx-6 px-6 py-4 bg-app-bg/50 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert size={18} className="text-brand-primary" />
                  Comparison View
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* AI Prediction */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                    <Check size={14} /> AI Prediction
                  </p>
                  <div className="p-5 bg-brand-primary/5 border-2 border-brand-primary/20 rounded-xl space-y-4">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-1">Category</p>
                      <p className="text-lg font-bold text-text-primary flex items-center gap-2">
                        {currentComplaint.category || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-1">Priority</p>
                      <p className="text-sm font-semibold text-text-primary">{currentComplaint.priority?.toUpperCase() || 'MEDIUM'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-1">Confidence</p>
                      <p className={`text-2xl font-black ${currentComplaint.ai_confidence > 0.8 ? 'text-emerald-500' : currentComplaint.ai_confidence > 0.6 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {Math.round((currentComplaint.ai_confidence || 0.9) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-2">Why AI thought this:</p>
                      <div className="space-y-1">
                        {aiReasons.map((r, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-text-secondary">"{r.term}"</span>
                            <span className="text-emerald-600 font-bold">{r.weight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Human Override */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                    <X size={14} /> Human Override
                  </p>
                  <div className="p-5 bg-rose-500/5 border-2 border-rose-500/20 rounded-xl space-y-4 opacity-50">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-1">Category</p>
                      <p className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <span className="line-through opacity-50">{currentComplaint.category}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-1">Priority</p>
                      <p className="text-sm font-semibold text-text-primary">{currentComplaint.priority?.toUpperCase() || 'MEDIUM'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase mb-1">Justification</p>
                      <p className="text-sm text-text-secondary italic">No override yet - this is a new case</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-border-subtle">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Case Description</p>
                <p className="text-sm text-text-secondary leading-relaxed">{currentComplaint.description}</p>
              </div>
            </div>

            {/* B. Verdict Controls */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={18} className="text-brand-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Verdict Controls</h3>
              </div>
              
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => handleVerdict('ai_correct')}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                >
                  <Check size={20} />
                  AI Was Correct
                  <span className="text-[10px] opacity-70">(training opportunity)</span>
                </button>
                <button 
                  onClick={() => handleVerdict('ai_wrong')}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-xl text-sm font-bold uppercase hover:bg-rose-600 transition-all flex items-center justify-center gap-3"
                >
                  <X size={20} />
                  AI Was Wrong
                  <span className="text-[10px] opacity-70">(flag for retraining)</span>
                </button>
                <button 
                  onClick={() => handleVerdict('skip')}
                  className="flex-1 py-4 bg-card-bg border border-border-subtle text-text-muted rounded-xl text-sm font-bold uppercase hover:border-brand-primary transition-all flex items-center justify-center gap-3"
                >
                  <SkipForward size={20} />
                  Skip / Uncertain
                </button>
              </div>
              
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Why? (Required for audit trail - min 10 characters)"
                className="w-full h-24 bg-card-bg border border-border-subtle rounded-xl p-4 text-sm focus:outline-none focus:border-brand-primary"
              />
              
              <div className="flex flex-wrap gap-2 mt-4">
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

          {/* C. Similar Case Finder & D. Calibration Gauge */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Similar Cases */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={18} className="text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Similar Cases</h3>
              </div>
              <p className="text-[10px] text-text-muted mb-4">Cases where AI predicted {currentComplaint.category} but was confirmed {currentComplaint.category}</p>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(similarCases.length > 0 ? similarCases : [
                  { id: 101, title: 'Similar issue pattern 1', ai_confidence: 0.72 },
                  { id: 102, title: 'Similar issue pattern 2', ai_confidence: 0.68 },
                  { id: 103, title: 'Similar issue pattern 3', ai_confidence: 0.65 }
                ]).slice(0, 5).map((c, i) => (
                  <div key={i} className="p-3 bg-card-bg border border-border-subtle rounded-lg hover:border-brand-primary cursor-pointer transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold">CMP-{c.id}</p>
                        <p className="text-[10px] text-text-muted truncate max-w-[150px]">{c.title}</p>
                      </div>
                      <span className="text-[10px] text-amber-500">{Math.round((c.ai_confidence || 0.8) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-[10px] text-amber-700">
                  Pattern: This is the 4th 'similar' issue this week
                </p>
              </div>
            </div>

            {/* Calibration Gauge */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 size={18} className="text-brand-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Calibration Gauge</h3>
              </div>
              <p className="text-[10px] text-text-muted mb-4">Override Accuracy per team member</p>
              
              <div className="space-y-4">
                {calibrationData.map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                      <User size={14} className="text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold">{user.overrides} overrides</span>
                        <span className={`${user.accuracy < 50 ? 'text-rose-500' : user.accuracy < 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {user.accuracy}% correct
                        </span>
                      </div>
                      <div className="w-full h-2 bg-card-bg rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${user.accuracy < 50 ? 'bg-rose-500' : user.accuracy < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${user.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue Progress */}
            <div className="card">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Queue Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Reviewed</span>
                  <span className="font-bold text-text-primary">{currentIndex}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Remaining</span>
                  <span className="font-bold text-text-primary">{complaints.length - currentIndex - 1}</span>
                </div>
                <div className="w-full h-3 bg-card-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary transition-all"
                    style={{ width: `${((currentIndex + 1) / complaints.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted">
                  <button onClick={handlePrev} disabled={currentIndex === 0} className="hover:text-brand-primary">← Previous</button>
                  <button onClick={handleSkip} disabled={currentIndex >= complaints.length - 1} className="hover:text-brand-primary">Next →</button>
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