import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Settings, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Search,
  Calendar,
  Layers,
  Database,
  Cpu,
  Trash2,
  ExternalLink,
  ShieldCheck,
  MoreVertical,
  Clock,
  Eye,
  FileSpreadsheet,
  RefreshCcw,
  TrendingUp
} from 'lucide-react';
import { api } from '../lib/api';

const StepIndicator = ({ current, total }) => (
  <div className="flex items-center gap-3">
    {[...Array(total)].map((_, i) => (
      <div key={i} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
          i + 1 < current ? 'bg-emerald-500 text-white' : 
          i + 1 === current ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-110' : 
          'bg-app-bg text-text-muted border border-border-subtle'
        }`}>
          {i + 1 < current ? <Check size={16} strokeWidth={3} /> : i + 1}
        </div>
        {i + 1 < total && (
           <div className={`w-10 h-0.5 mx-1 ${i + 1 < current ? 'bg-emerald-500' : 'bg-border-subtle'}`} />
        )}
      </div>
    ))}
  </div>
);

const ReportGenerator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);
  const [reportConfig, setReportConfig] = useState({
    type: 'Summary',
    format: 'PDF',
    includeCharts: true,
    includeRawData: false,
    range: 'L-7D'
  });

  const CACHE_KEY = 'tarkshastra_reports_cache';

  const getCachedReports = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  };

  const saveReportToCache = (report) => {
    try {
      const cached = getCachedReports();
      const newReport = {
        ...report,
        cachedAt: new Date().toISOString()
      };
      cached.unshift(newReport);
      // Keep only last 20 reports
      const limited = cached.slice(0, 20);
      localStorage.setItem(CACHE_KEY, JSON.stringify(limited));
      setReportHistory(limited);
    } catch (err) {
      console.error('Failed to save to cache:', err);
    }
  };

  const flushCache = () => {
    if (confirm('Flush all cached reports? This cannot be undone.')) {
      localStorage.removeItem(CACHE_KEY);
      setReportHistory([]);
    }
  };

  const downloadFromCache = (report) => {
    if (!report.content) return;
    
    let blob;
    if (report.content_type === 'application/pdf') {
      const binaryString = window.atob(report.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: 'application/pdf' });
    } else {
      blob = new Blob([report.content], { type: 'text/csv' });
    }
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = report.url.split('/').pop() || `${report.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  useEffect(() => {
    setReportHistory(getCachedReports());
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/reports').catch(() => ({ reports: [] }));
      setReportHistory(res.reports || []);
    } catch (err) {
      console.error('Failed to fetch report history', err);
    }
  };

  const startGeneration = () => {
    setStep(3);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/reports/generate', reportConfig);
      console.log('Report generated:', res);
      
      if (res.content) {
        let blob;
        const filename = res.url.split('/').pop() || `${res.id}.csv`;

        if (res.content_type === 'application/pdf') {
          // Decode Base64 to binary
          const binaryString = window.atob(res.content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: 'application/pdf' });
        } else {
          blob = new Blob([res.content], { type: 'text/csv' });
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      setTimeout(() => {
        setIsGenerating(false);
        // Save to cache after successful download
        saveReportToCache({
          id: res.id,
          type: res.template || reportConfig.type,
          date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
          size: res.size,
          status: res.status,
          content: res.content,
          content_type: res.content_type,
          url: res.url,
          format: reportConfig.format
        });
      }, 1000);
    } catch (err) {
      console.error('Report generation failed', err);
      setIsGenerating(false);
      alert('Security Protocol: Report generation rejected by vault.');
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
             <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra Ledger Intel</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Report Engineering Studio</h1>
          </div>
          <StepIndicator current={step} total={3} />
        </header>

        <div className="grid grid-cols-12 gap-8">
           
           {/* Wizard Canvas (8 cols) */}
           <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <div className="card min-h-[600px] flex flex-col relative overflow-hidden bg-[#0F172A]/40 backdrop-blur-xl">
                 <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10 flex-1"
                      >
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl"><Layers size={24} /></div>
                            <div>
                               <h3 className="text-xl font-black tracking-tight uppercase">Template Selection</h3>
                               <p className="text-xs text-text-secondary font-medium mt-1">Select the core structure for intelligence output</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { t: 'Strategic Summary', d: 'High-level KPI overview for executive review.', i: FileText, type: 'Summary' },
                              { t: 'Operational Audit', d: 'Granular complaint tracking and agent throughput.', i: Settings, type: 'Audit' },
                              { t: 'Safety & Risk', d: 'Detailed analysis of P0 breaches and safety leaks.', i: Database, type: 'Safety' },
                              { t: 'Neural Insight', d: 'Model accuracy reports and SHAP influence logs.', i: Cpu, type: 'Neural' },
                            ].map(item => (
                              <button 
                                key={item.t} 
                                onClick={() => setReportConfig({ ...reportConfig, type: item.type })}
                                className={`p-8 text-left rounded-3xl transition-all group flex flex-col gap-5 border-2 ${
                                  reportConfig.type === item.type ? 'bg-brand-primary/10 border-brand-primary shadow-2xl shadow-brand-primary/10' : 'bg-app-bg border-border-subtle hover:border-brand-primary/40'
                                }`}
                              >
                                 <div className={`p-3 rounded-2xl border transition-all w-fit shadow-sm ${
                                   reportConfig.type === item.type ? 'bg-brand-primary text-white border-brand-primary' : 'bg-card-bg border-border-subtle group-hover:text-brand-primary'
                                 }`}>
                                    <item.i size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-extrabold text-sm mb-1 uppercase tracking-tight">{item.t}</h4>
                                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 font-medium opacity-80">{item.d}</p>
                                 </div>
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                       <motion.div 
                         key="step2"
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="space-y-10 flex-1"
                       >
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl"><Calendar size={24} /></div>
                             <div>
                                <h3 className="text-xl font-black tracking-tight uppercase">Parameter Matrix</h3>
                                <p className="text-xs text-text-secondary font-medium mt-1">Configure telemetry windows and inclusion logic</p>
                             </div>
                          </div>
                          
                          <div className="space-y-10">
                             <div className="space-y-4">
                                <label className="text-tiny text-text-muted font-black tracking-[0.2em] uppercase px-1">Telemetry Window</label>
                                <div className="flex gap-4">
                                   {['L-24H', 'L-7D', 'L-30D', 'QTD'].map(h => (
                                     <button 
                                       key={h} 
                                       onClick={() => setReportConfig({ ...reportConfig, range: h })}
                                       className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all uppercase border-2 ${
                                         reportConfig.range === h ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' : 'bg-app-bg border-border-subtle text-text-muted'
                                       }`}
                                     >
                                        {h}
                                     </button>
                                   ))}
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                   <label className="text-tiny text-text-muted font-black tracking-[0.2em] uppercase px-1">Output Protocol</label>
                                   <div className="flex bg-app-bg p-1.5 rounded-2xl border border-border-subtle">
                                      {['PDF', 'Excel'].map(f => (
                                        <button 
                                          key={f} 
                                          onClick={() => setReportConfig({ ...reportConfig, format: f })}
                                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                                            reportConfig.format === f ? 'bg-card-bg text-brand-primary shadow-sm' : 'text-text-muted'
                                          }`}
                                        >
                                           {f === 'PDF' ? <FileText size={14} /> : <FileSpreadsheet size={14} />}
                                           {f}
                                        </button>
                                      ))}
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <label className="text-tiny text-text-muted font-black tracking-[0.2em] uppercase px-1">Data Depth</label>
                                   <div className="space-y-3">
                                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setReportConfig({ ...reportConfig, includeCharts: !reportConfig.includeCharts })}>
                                         <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${reportConfig.includeCharts ? 'bg-brand-primary border-brand-primary' : 'border-slate-700 bg-app-bg'}`}>
                                            {reportConfig.includeCharts && <Check size={14} className="text-white" strokeWidth={4} />}
                                         </div>
                                         <span className="text-[11px] font-bold text-text-primary group-hover:text-brand-primary">Include Visual Charts</span>
                                      </div>
                                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setReportConfig({ ...reportConfig, includeRawData: !reportConfig.includeRawData })}>
                                         <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${reportConfig.includeRawData ? 'bg-brand-primary border-brand-primary' : 'border-slate-700 bg-app-bg'}`}>
                                            {reportConfig.includeRawData && <Check size={14} className="text-white" strokeWidth={4} />}
                                         </div>
                                         <span className="text-[11px] font-bold text-text-primary group-hover:text-brand-primary">Include RAW Data Ledger</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="space-y-4">
                                <label className="text-tiny text-text-muted font-black tracking-[0.2em] uppercase px-1">Audit scope</label>
                                <div className="relative">
                                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted rotate-90" />
                                   <input 
                                     type="text" 
                                     placeholder="Filter by Node_ID, Agent_UID, or Category..."
                                     className="w-full h-16 bg-app-bg/50 border-2 border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-brand-primary transition-all shadow-inner"
                                   />
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}

                    {step === 3 && (
                       <motion.div 
                         key="step3"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.05 }}
                         className="flex flex-col flex-1 h-full space-y-8"
                       >
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Eye size={24} /></div>
                                <div>
                                   <h3 className="text-xl font-black tracking-tight uppercase">Render Preview</h3>
                                   <p className="text-xs text-text-secondary font-medium mt-1">Simulated output matching configured parameters</p>
                                </div>
                             </div>
                             <div className="flex gap-4">
                                <button className="p-2.5 bg-app-bg border border-border-subtle rounded-xl text-text-muted hover:text-white transition-all"><RefreshCcw size={18} /></button>
                                <button className="p-2.5 bg-app-bg border border-border-subtle rounded-xl text-text-muted hover:text-white transition-all"><Maximize2 size={18} /></button>
                             </div>
                          </div>
                          
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group">
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                             
                             {/* Mock Iframe Content */}
                             <div className="w-full h-full p-12 overflow-y-auto space-y-8 bg-white selection:bg-brand-primary/20 text-slate-900 font-serif">
                                <header className="border-b-4 border-slate-900 pb-8 flex justify-between items-end">
                                   <div>
                                      <h1 className="text-4xl font-black uppercase tracking-tight italic">TarkShastra Intel</h1>
                                      <p className="text-sm font-bold mt-2 text-slate-500 tracking-widest uppercase">Protocol: {reportConfig.type} AUDIT</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="font-black text-lg">REP_{Math.floor(Math.random()*9000)+1000}</p>
                                      <p className="text-[10px] font-bold text-slate-400">TIMESTAMP: {new Date().toISOString()}</p>
                                   </div>
                                </header>
                                <section className="space-y-4 font-sans">
                                   <h2 className="text-xl font-black uppercase tracking-wide border-l-8 border-brand-primary pl-4">Executive Extraction</h2>
                                   <p className="text-sm leading-relaxed text-slate-600 font-medium">
                                      Current telemetry data indicates a <strong>14.2% surge</strong> in P0 anomalies within the TS-8 Hardware Node. 
                                      Mean recovery time has drifted to 2.4h, exceeding core SLA compliance by 12.5%.
                                   </p>
                                </section>
                                {reportConfig.includeCharts && (
                                   <section className="h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                                      <div className="text-center">
                                         <TrendingUp className="mx-auto text-slate-300" size={48} />
                                         <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Procedural Chart Matrix</p>
                                      </div>
                                   </section>
                                )}
                                <footer className="pt-12 text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] text-center italic">
                                   Verified Sovereign AI Audit — Vault-L8 Access Only
                                </footer>
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {/* Wizard Control Strip */}
                 <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center relative z-10">
                    {step > 1 ? (
                      <button 
                        onClick={() => setStep(step - 1)} 
                        className="flex items-center gap-3 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all bg-slate-900/50 rounded-2xl border border-slate-800"
                      >
                         <ChevronLeft size={18} />
                         Revise Sequence
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-rose-500/70 hover:text-rose-500 transition-all bg-app-bg rounded-2xl border border-border-subtle"
                      >
                         <Trash2 size={16} />
                         Abort Engineering
                      </button>
                    )}
                    
                    {step < 3 ? (
                      <button 
                        onClick={() => setStep(step + 1)} 
                        className="btn-primary flex items-center gap-3 px-12 py-4 relative group rounded-2xl shadow-xl shadow-brand-primary/20"
                      >
                         Continue Sequence
                         <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleDownload} 
                        disabled={isGenerating}
                        className="btn-primary flex items-center gap-4 px-12 py-4 relative overflow-hidden rounded-2xl shadow-2xl shadow-brand-primary/40"
                      >
                         <AnimatePresence mode="wait">
                            {isGenerating ? (
                               <motion.div 
                                 key="gen"
                                 initial={{ y: 20, opacity: 0 }}
                                 animate={{ y: 0, opacity: 1 }}
                                 exit={{ y: -20, opacity: 0 }}
                                 className="flex items-center gap-3"
                               >
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span className="font-black uppercase tracking-[0.2em] text-[10px]">Encrypting Vault Output...</span>
                               </motion.div>
                            ) : (
                               <motion.div 
                                 key="idle"
                                 initial={{ y: 20, opacity: 0 }}
                                 animate={{ y: 0, opacity: 1 }}
                                 exit={{ y: -20, opacity: 0 }}
                                 className="flex items-center gap-3"
                               >
                                  <Download size={20} />
                                  <span className="font-extrabold uppercase tracking-widest">Finalize & Download</span>
                               </motion.div>
                            )}
                         </AnimatePresence>
                      </button>
                    )}
                 </div>
              </div>
           </div>

           {/* Performance Sidebar (4 cols) */}
           <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              <div className="card space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <History size={18} className="text-brand-primary" />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Engineering History</h3>
                    </div>
                    <button onClick={flushCache} className="text-[10px] font-black uppercase text-brand-primary hover:underline">Flush Cache</button>
                 </div>
                 
                 <div className="space-y-4">
                    {reportHistory.map(item => (
                       <div key={item.id} className="p-5 bg-app-bg border border-border-subtle rounded-3xl group transition-all hover:border-brand-primary/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                             <FileText size={40} />
                          </div>
                          <div className="flex justify-between items-start mb-4 relative z-10">
                             <div>
                                <h4 className="text-xs font-black text-text-primary uppercase tracking-tight">{item.type}</h4>
                                <p className="text-[10px] text-text-muted mt-1 font-medium">{item.date}</p>
                             </div>
                             <button className="p-2 hover:bg-card-bg rounded-xl transition-colors text-text-muted"><MoreVertical size={16} /></button>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-border-subtle relative z-10">
                             <div className="flex gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                                  item.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-200/5 text-slate-500 border-slate-700/50'
                                }`}>
                                  {item.status}
                                </span>
                                <span className="text-[10px] font-mono text-text-muted font-bold self-center">{item.size}</span>
                             </div>
                             <button onClick={() => downloadFromCache(item)} className="p-2.5 bg-card-bg border border-border-subtle rounded-xl text-text-muted hover:text-brand-primary shadow-sm hover:scale-110 transition-all active:scale-95"><Download size={16} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="card border-brand-primary/20 bg-brand-primary/5 space-y-6 shadow-2xl shadow-brand-primary/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 text-brand-primary opacity-10 group-hover:scale-125 transition-transform duration-1000">
                    <ShieldCheck size={100} />
                 </div>
                 <div className="flex items-center gap-3 text-brand-primary relative z-10">
                    <ShieldCheck size={20} />
                    <h3 className="text-sm font-black tracking-widest uppercase">Encryption Access</h3>
                 </div>
                 <p className="text-xs text-text-secondary leading-relaxed font-medium relative z-10">
                    Intelligence reports are shredded 7 days post-generation. Output is encrypted with <strong>TS-ROOT-SHA</strong> signatures. 
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-primary group relative z-10">
                    Identity Protocol Access Log
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>

              <div className="card !p-0 overflow-hidden bg-app-bg border-dashed text-text-primary group">
                 <div className="p-6 bg-amber-500/5 flex items-center gap-5 transition-colors group-hover:bg-amber-500/10">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><Clock size={28} className="animate-spin-slow" /></div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600/60">Cache Auto-Purge</p>
                       <p className="text-sm font-black tracking-tight mt-0.5">Purge Cycle: <span className="text-amber-600">14h 22m</span></p>
                    </div>
                 </div>
              </div>
           </div>

          </div>
       </div>
  );
};

// Internal icon and style helpers
const History = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);

const Maximize2 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

export default ReportGenerator;
