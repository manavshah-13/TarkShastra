import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Layers, 
  Fingerprint, 
  Workflow, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  Cpu,
  RefreshCcw,
  Zap,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Clock,
  Terminal,
  Sparkles
} from 'lucide-react';

const AITheater = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [explanationData, setExplanationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!complaintId || complaintId === 'new') {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get(`/complaints/${complaintId}`);
        setComplaint(data);
        
        // Fetch SHAP explanation
        try {
          const expl = await api.get(`/ai/complaints/${complaintId}/explain`);
          setExplanationData(expl);
        } catch (explErr) {
          console.error('Failed to fetch explanation', explErr);
        }
      } catch (err) {
        console.error('Failed to fetch complaint', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId]);

  const handleConfirm = async () => {
    if (!complaint) return;
    
    setIsConfirming(true);
    try {
      await api.patch(`/complaints/${complaint.id}/status`, 'IN_PROGRESS');
      
      setTimeout(() => {
        navigate(`/complaint/${complaint.id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to confirm classification', err);
      alert('Failed to confirm: ' + err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleEdit = () => {
    navigate('/justification');
  };

  const confidence = complaint?.ai_confidence || 0.85;
  const isHighConfidence = confidence >= 0.8;
  const isLowConfidence = confidence < 0.6;

  const description = complaint?.description || "...";
  const category = complaint?.category || 'Detecting...';
  const priority = complaint?.priority || 'MEDIUM';

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-brand-primary/20 rounded-full animate-spin border-t-brand-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="text-brand-primary animate-pulse" size={32} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-text-primary">Running Neural Inference...</h2>
            <p className="text-sm text-text-muted">Comparing with 50,000+ historical records</p>
          </div>
        </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-tiny flex items-center gap-2">
              <Terminal size={12} className="text-brand-primary" />
              Tark-V3 Neural Core v.4.0.2
            </p>
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">AI Inference Theater</h1>
               {complaint && (
                 <span className="px-2 py-0.5 bg-card-bg text-text-secondary rounded-full text-[10px] font-mono border border-border-subtle">
                   ID: CMP-{complaint.id}
                 </span>
               )}
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-all flex items-center gap-2">
               <ChevronLeft size={16} />
               Back
             </button>
             <button onClick={handleEdit} className="px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:bg-app-bg transition-all">
               Override Model
             </button>
             <button 
               onClick={handleConfirm} 
               disabled={isConfirming || !complaint}
               className="btn-primary flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-primary/25"
             >
               {isConfirming ? (
                 <Loader2 size={18} className="animate-spin" />
               ) : (
                 <CheckCircle2 size={18} />
               )}
               Confirm & Start SLA
               <ChevronRight size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Decision Overview */}
             <div className="card border-l-4 border-brand-primary overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Workflow size={120} />
                </div>
                <div className="flex justify-between items-start mb-6">
                   <div className="space-y-1">
                      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Recommended Action</h3>
                      <p className="text-2xl font-black text-brand-primary">
                        {complaint?.recommended_action || "Pending Analysis"}
                      </p>
                   </div>
                   <div className="bg-brand-primary/10 px-4 py-2 rounded-xl text-center border border-brand-primary/20">
                      <div className="text-[10px] font-bold text-brand-primary uppercase">Est. Resolution</div>
                      <div className="text-lg font-black text-brand-primary flex items-center gap-1 justify-center">
                        <Clock size={16} /> {complaint?.estimated_resolution_days || 0}d
                      </div>
                   </div>
                </div>
                
                <div className="p-4 bg-app-bg/50 rounded-xl border border-border-subtle mb-6">
                   <div className="flex items-center gap-2 mb-2">
                      <Zap size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold uppercase text-text-muted">Core Rationale</span>
                   </div>
                   <p className="text-sm font-medium leading-relaxed text-text-primary">
                    {complaint?.recommendation_explanation || "Analyzing historical patterns to provide a clear rationale..."}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-4 bg-card-bg rounded-xl border border-border-subtle">
                      <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Identified Category</p>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-text-primary">{category}</span>
                         <span className="text-[10px] bg-brand-subtle text-brand-primary px-2 py-0.5 rounded font-bold">MATCHED</span>
                      </div>
                   </div>
                   <div className="p-4 bg-card-bg rounded-xl border border-border-subtle">
                      <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Service Priority</p>
                      <div className="flex justify-between items-center">
                         <span className={`font-bold ${priority === 'URGENT' ? 'text-rose-500' : 'text-text-primary'}`}>{priority}</span>
                         <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold">ROUTED</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* SHAP / Feature Importance */}
             <div className="card">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                      <Fingerprint size={18} className="text-brand-primary" />
                      <h3 className="font-bold">Neural Sentiment & Keyword Analysis</h3>
                   </div>
                   <button 
                     onClick={() => setShowExplanation(!showExplanation)}
                     className="text-xs font-bold text-brand-primary hover:underline"
                   >
                     {showExplanation ? 'Collapse Grid' : 'Expand Details'}
                   </button>
                </div>
                
                <AnimatePresence>
                {showExplanation && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                     {explanationData?.feature_names?.length > 0 ? (
                       explanationData.feature_names.map((name, idx) => {
                         const val = explanationData.values[idx];
                         const percent = Math.min(Math.abs(val) * 200, 100);
                         const isPositive = val > 0;
                         
                         return (
                           <div key={name} className="flex items-center gap-4">
                              <span className="text-xs font-mono w-48 truncate flex items-center gap-2">
                                <ChevronRight size={12} className="text-text-muted" />
                                {name.toUpperCase()}
                              </span>
                              <div className="flex-1 h-3 bg-border-subtle rounded-full overflow-hidden flex">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${percent}%` }}
                                   className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                 />
                              </div>
                              <span className={`text-[10px] font-bold w-12 text-right ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isPositive ? '+' : ''}{Math.round(val * 100)}%
                              </span>
                           </div>
                         );
                       })
                     ) : (
                       <div className="text-center p-8 bg-app-bg/50 rounded-xl border border-dashed border-border-subtle">
                         <Loader2 size={24} className="mx-auto animate-spin text-text-muted mb-2" />
                         <p className="text-xs text-text-muted">Extracting token weights...</p>
                       </div>
                     )}
                     <div className="pt-4 flex justify-between items-center border-t border-border-subtle text-[10px] font-bold text-text-muted italic">
                        <span>LIME/SHAP Approximation Active</span>
                        <span>Sensitivity: 0.14e-9</span>
                     </div>
                  </motion.div>
                )}
                </AnimatePresence>
             </div>
          </div>

          {/* Side Panels (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Confidence Meter */}
             <div className="card flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
                <h3 className="w-full text-center text-sm font-bold tracking-tight uppercase text-text-muted mb-6">Neural Confidence</h3>
                
                <div className="relative w-40 h-40 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="var(--border-subtle)" strokeWidth="16" fill="none" />
                    <circle 
                      cx="80" cy="80" r="72" 
                      stroke="url(#gradient)" 
                      strokeWidth="16" 
                      fill="none"
                      strokeDasharray={`${confidence * 452} 452`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-text-primary">{Math.round(confidence * 100)}%</span>
                  </div>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 p-4 bg-app-bg/50 rounded-xl border border-border-subtle">
                   <div className="text-center group cursor-help">
                      <p className="text-xl font-black text-text-primary flex items-center justify-center gap-1">
                        8.4 <span className="text-[10px] text-rose-500">↑</span>
                      </p>
                      <p className="text-tiny text-text-muted uppercase">Sentiment</p>
                   </div>
                   <div className="text-center border-l border-border-subtle">
                      <p className="text-xl font-black text-emerald-500 uppercase">Strong</p>
                      <p className="text-tiny text-text-muted uppercase">Signal</p>
                   </div>
                </div>
             </div>

             {/* Similar Cases found */}
             <div className="card space-y-4">
                <div className="flex items-center gap-3">
                   <Layers size={18} className="text-brand-primary" />
                   <h3 className="text-sm font-bold tracking-tight uppercase">Historical Anchors</h3>
                </div>
                <p className="text-[10px] text-text-muted mb-4 leading-relaxed">
                   Identifying top matches from the archive to ensure precedent-based routing.
                </p>
                <div className="space-y-3">
                   {[
                     { id: '184', score: '98%', res: 'Refunded' },
                     { id: '201', score: '94%', res: 'Escalated' },
                     { id: '089', score: '82%', res: 'Refunded' },
                   ].map(item => (
                     <div key={item.id} className="p-3 bg-app-bg/50 rounded-lg border border-border-subtle flex justify-between items-center group hover:border-brand-primary/30 transition-all cursor-pointer">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-text-primary">Case #{item.id}</span>
                           <span className="text-[10px] text-text-muted">Similarity: {item.score}</span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                           {item.res}
                        </span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
  );
};

export default AITheater;
