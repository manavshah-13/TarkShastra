import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
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
  AlertTriangle
} from 'lucide-react';

const AITheater = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!complaintId || complaintId === 'new') {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get(`/complaints/${complaintId}`);
        setComplaint(data);
      } catch (err) {
        console.error('Failed to fetch complaint', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const handleConfirm = async () => {
    if (!complaint) return;
    
    setIsConfirming(true);
    try {
      await api.patch(`/complaints/${complaint.id}/status`, 'CLASSIFIED');
      
      setTimeout(() => {
        navigate(`/complaint/${complaint.id}`);
      }, 2000);
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

  const confidence = complaint?.ai_confidence || 0.94;
  const isHighConfidence = confidence >= 0.9;
  const isLowConfidence = confidence < 0.7;

  const radarData = [
    { subject: 'Toxicity', A: 120, fullMark: 150 },
    { subject: 'Urgency', A: 98, fullMark: 150 },
    { subject: 'Sentiment', A: 86, fullMark: 150 },
    { subject: 'Complexity', A: 99, fullMark: 150 },
    { subject: 'Consistency', A: 85, fullMark: 150 },
  ];

  const description = complaint?.description || "The device arrived with a cracked screen. I'm very disappointed with the service so far.";
  const category = complaint?.category || 'Hardware';
  const priority = complaint?.priority || 'P0';

  return (
    <AppLayout activePage="Analytics">
      <div className="max-w-[1500px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-tiny">Tark-V3 Neural Core</p>
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">AI Inference Theater</h1>
               {complaint ? (
                 <span className="px-2 py-0.5 bg-card-bg text-text-secondary rounded-full text-[10px] font-mono border border-border-subtle">
                   CMP-{complaint.id}
                 </span>
               ) : (
                 <div className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold border border-brand-primary/20 animate-pulse">
                   REAL-TIME PROCESSING
                 </div>
               )}
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-all flex items-center gap-2">
               <ChevronLeft size={16} />
               Back
             </button>
             <button onClick={handleEdit} className="px-4 py-2 border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:bg-app-bg transition-all">
               Modify Classification
             </button>
             <button 
               onClick={handleConfirm} 
               disabled={isConfirming || !complaint}
               className="btn-primary flex items-center gap-2 disabled:opacity-50"
             >
               {isConfirming ? (
                 <Loader2 size={18} className="animate-spin" />
               ) : (
                 <CheckCircle2 size={18} />
               )}
               Confirm & Deploy
               <ChevronRight size={18} />
             </button>
          </div>
        </header>

        {/* Confidence Warning Banners */}
        {isLowConfidence && (
          <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle size={20} className="text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">
              Low confidence ({Math.round(confidence * 100)}%) - Manual review recommended
            </span>
          </div>
        )}
        
        {isHighConfidence && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">
              High confidence prediction ({Math.round(confidence * 100)}%)
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Comparison View (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="card space-y-6">
                <div className="flex justify-between items-center border-b border-border-subtle -m-6 p-4 mb-2 bg-app-bg/50">
                   <div className="flex items-center gap-3">
                      <Workflow size={18} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Classification Analysis</h3>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-brand-subtle rounded-lg">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Category:</span>
                        <span className="text-xs font-bold text-brand-primary">{category}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-lg">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Priority:</span>
                        <span className="text-xs font-bold text-rose-500">{priority}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-subtle rounded-2xl overflow-hidden bg-app-bg/30">
                   {/* Original */}
                   <div className="p-6 border-r border-border-subtle space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-tiny bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-text-secondary">RAW INPUT</span>
                         {complaint && <span className="text-[10px] font-mono text-text-muted">ID: {complaint.id}</span>}
                      </div>
                      <div className="p-4 bg-card-bg rounded-xl border border-border-subtle min-h-[140px] text-sm leading-relaxed text-text-secondary">
                        {description}
                      </div>
                   </div>

                   {/* AI Interpretation */}
                   <div className="p-6 space-y-4 bg-brand-primary/5">
                      <div className="flex items-center justify-between">
                         <span className="text-tiny bg-brand-primary text-white px-2 py-0.5 rounded">AI INTERPRETATION</span>
                         <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px]">
                            <CheckCircle2 size={10} /> VERIFIED
                         </div>
                      </div>
                      <div className="p-4 bg-card-bg rounded-xl border border-brand-primary/20 min-h-[140px] text-sm leading-relaxed text-text-primary">
                        <p>Category: <span className="font-bold text-brand-primary">{category}</span></p>
                        <p>Priority: <span className="font-bold text-rose-500">{priority}</span></p>
                        <p className="mt-2 text-text-secondary">Confidence: {Math.round(confidence * 100)}%</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="card">
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-3 mb-6 w-full text-left"
                >
                   <Fingerprint size={18} className="text-brand-primary" />
                   <h3 className="font-bold">SHAP Influence Analysis</h3>
                   <HelpCircle size={14} className="text-text-muted cursor-help ml-1" />
                </button>
                
                {showExplanation && (
                  <div className="space-y-6">
                     {[
                       { l: 'Primary Entity Keyword: "Screen"', v: 85, c: 'bg-emerald-500' },
                       { l: 'Temporal Context: "Arrived"', v: 62, c: 'bg-emerald-500' },
                       { l: 'Tone Descriptor: "Disappointed"', v: 12, c: 'bg-rose-500' },
                       { l: 'Secondary Entity: "Device"', v: 45, c: 'bg-emerald-500' },
                     ].map(item => (
                       <div key={item.l} className="flex items-center gap-4">
                          <span className="text-xs font-semibold w-56 truncate">{item.l}</span>
                          <div className="flex-1 h-2 bg-border-subtle rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${item.v}%` }}
                               className={`h-full ${item.c}`} 
                             />
                          </div>
                          <span className={`text-[10px] font-bold w-12 text-right ${item.c.replace('bg-', 'text-')}`}>{item.v > 50 ? '+' : '-'}{item.v}%</span>
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>

          {/* Visualization Radar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="card flex flex-col items-center">
                <h3 className="w-full text-center text-sm font-bold tracking-tight uppercase text-text-muted mb-4">Confidence Score</h3>
                
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="var(--border-subtle)" strokeWidth="12" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke={isHighConfidence ? '#10B981' : isLowConfidence ? '#F59E0B' : '#3B82F6'} 
                      strokeWidth="12" 
                      fill="none"
                      strokeDasharray={`${confidence * 351} 351`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-text-primary">{Math.round(confidence * 100)}%</span>
                  </div>
                </div>
                
                <div className="pt-4 grid grid-cols-2 gap-4 w-full">
                   <div className="text-center">
                      <p className="text-2xl font-black text-text-primary">8.2</p>
                      <p className="text-tiny">Toxicity Index</p>
                   </div>
                   <div className="text-center border-l border-border-subtle">
                      <p className="text-2xl font-black text-emerald-500">High</p>
                      <p className="text-tiny">Confidence Level</p>
                   </div>
                </div>
             </div>

             <div className="card space-y-4 bg-app-bg/30">
                <div className="flex items-center gap-3">
                   <Cpu size={18} className="text-brand-primary" />
                   <h3 className="text-sm font-bold">Neural Parameters</h3>
                </div>
                <div className="space-y-4 pt-2">
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-secondary">Model Version</span>
                      <span className="font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Tark-v3.2.1</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-secondary">Temperature</span>
                      <span className="font-mono">0.42</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-secondary">Token Latency</span>
                      <span className="font-mono">14ms / tx</span>
                   </div>
                </div>
             </div>

             <div className="card text-center p-8 border-2 border-[var(--primary)] border-dashed bg-brand-primary/5 group cursor-pointer hover:bg-brand-primary/10 transition-all">
                <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <Layers size={24} />
                </div>
                <h4 className="font-bold mb-2">Manual Retrain</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                   Not satisfied with the output? Flag this inference pair for the next fine-tuning cycle.
                </p>
             </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default AITheater;
