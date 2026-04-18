import React from 'react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { 
  ShieldAlert, 
  Layers, 
  Fingerprint, 
  Workflow, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Cpu,
  RefreshCcw,
  Zap
} from 'lucide-react';

const AITheater = ({ onNext, onPrev }) => {
  const pieData = [
    { name: 'Hardware', value: 400 },
    { name: 'Billing', value: 300 },
    { name: 'Service', value: 300 },
  ];

  const radarData = [
    { subject: 'Toxicity', A: 120, fullMark: 150 },
    { subject: 'Urgency', A: 98, fullMark: 150 },
    { subject: 'Sentiment', A: 86, fullMark: 150 },
    { subject: 'Complexity', A: 99, fullMark: 150 },
    { subject: 'Consistency', A: 85, fullMark: 150 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <AppLayout activePage="Analytics">
      <div className="max-w-[1500px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-tiny">Tark-V3 Neural Core</p>
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">AI Inference Theater</h1>
               <div className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold border border-brand-primary/20 animate-pulse">
                 REAL-TIME PROCESSING
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={onPrev} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-all">
                Audit Raw Input
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                Validate & Deploy
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Comparison View (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="card space-y-6">
                <div className="flex justify-between items-center border-b border-border-subtle -m-6 p-4 mb-2 bg-app-bg/50">
                   <div className="flex items-center gap-3">
                      <Workflow size={18} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Side-by-Side Classification Diff</h3>
                   </div>
                   <div className="flex bg-input-bg p-1 rounded-lg">
                      <button className="px-3 py-1 bg-card-bg text-brand-primary text-[10px] font-bold rounded shadow-sm">Text Diff</button>
                      <button className="px-3 py-1 text-text-muted text-[10px] font-bold rounded">Entity Mapping</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-subtle rounded-2xl overflow-hidden bg-app-bg/30">
                   {/* Original */}
                   <div className="p-6 border-r border-border-subtle space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-tiny bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-text-secondary">AI SOURCE</span>
                         <span className="text-[10px] font-mono text-text-muted">ID: TS-881</span>
                      </div>
                      <div className="p-4 bg-card-bg rounded-xl border border-border-subtle min-h-[140px] text-sm leading-relaxed text-text-secondary italic">
                        "The device arrived with a cracked screen. I'm very 
                        <span className="bg-rose-500/10 text-rose-500 px-1 line-through">disappointed</span> 
                        with the service so far."
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold"><span>REDUNDANCY</span><span>88%</span></div>
                         <div className="h-1.5 w-full bg-border-subtle rounded-full"><div className="h-full bg-brand-primary w-[88%]" /></div>
                      </div>
                   </div>

                   {/* Refined */}
                   <div className="p-6 space-y-4 bg-brand-primary/5">
                      <div className="flex items-center justify-between">
                         <span className="text-tiny bg-brand-primary text-white px-2 py-0.5 rounded">REFINED OUTPUT</span>
                         <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px]">
                            <RefreshCcw size={10} /> 99.2% RECONSTRUCTION
                         </div>
                      </div>
                      <div className="p-4 bg-card-bg rounded-xl border border-brand-primary/20 min-h-[140px] text-sm leading-relaxed text-text-primary">
                        "Device received with physical damage (cracked display). 
                        <span className="bg-emerald-500/10 text-emerald-600 px-1 font-bold">Severity: High</span>. 
                        Requesting immediate replacement per warranty block v2."
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold"><span>CLARITY GAIN</span><span className="text-emerald-500">+42%</span></div>
                         <div className="h-1.5 w-full bg-border-subtle rounded-full"><div className="h-full bg-emerald-500 w-[94%]" /></div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="card">
                <div className="flex items-center gap-3 mb-8">
                   <Fingerprint size={18} className="text-brand-primary" />
                   <h3>SHAP Influence Analysis</h3>
                   <HelpCircle size={14} className="text-text-muted cursor-help ml-1" />
                </div>
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
             </div>
          </div>

          {/* Visualization Radar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="card flex flex-col items-center">
                <h3 className="w-full text-center text-sm font-bold tracking-tight uppercase text-text-muted mb-4">Sentiment Spectrum</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="var(--border-subtle)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Radar name="Scoring" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4 w-full">
                   <div className="text-center">
                      <p className="text-2xl font-black text-text-primary">8.2</p>
                      <p className="text-tiny">Toxicity Index</p>
                   </div>
                   <div className="text-center border-l border-border-subtle">
                      <p className="text-2xl font-black text-emerald-500">94%</p>
                      <p className="text-tiny">Resolution Confidence</p>
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
                      <span className="font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Tark-v3.2.1-stable</span>
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
