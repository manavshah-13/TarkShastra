import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Terminal as TerminalIcon,
  Database,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Trash2,
  RefreshCcw,
  Zap,
  ChevronDown,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { api } from '../lib/api';

const ProgressStage = ({ title, status, active }) => (
  <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${active ? 'bg-brand-primary/5 border-brand-primary shadow-xl shadow-brand-primary/10' : 'bg-app-bg border-border-subtle opacity-60'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
      status === 'complete' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
      status === 'error' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 
      active ? 'bg-brand-primary text-white shadow-2xl shadow-brand-primary/40' : 'bg-card-bg text-text-muted border border-border-subtle'
    }`}>
      {status === 'complete' ? <CheckCircle2 size={24} strokeWidth={3} /> : status === 'error' ? <AlertCircle size={24} /> : active ? <RefreshCcw size={22} className="animate-spin" /> : <FileText size={22} />}
    </div>
    <div className="flex-1 min-w-0">
       <h4 className="text-sm font-black tracking-tight uppercase text-text-primary">{title}</h4>
       <p className="text-[10px] font-bold text-text-muted tracking-[0.2em]">{status === 'complete' ? 'VERIFIED' : status === 'pending' ? 'IN QUEUE' : 'PROCESSING'}</p>
    </div>
    {status === 'complete' && (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500 font-black text-xs">
        100%
      </motion.div>
    )}
  </div>
);

const BatchUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle, validating, uploading, processing, complete
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [jobStats, setJobStats] = useState({ success: 0, failed: 0, total: 0 });
  const [errors, setErrors] = useState([]);
  const [logs, setLogs] = useState([
    '[SYSTEM] Initializing IngestorNode v4.2.1-stable',
    '[SECURE] SSL Handshake established with Vault-L8',
  ]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    validateCSV(selectedFile);
  };

  const validateCSV = (file) => {
    setUploadState('validating');
    addLog(`Scanning payload: ${file.name} (Size: ${(file.size / 1024).toFixed(1)} KB)`);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const headers = text.split('\n')[0].toLowerCase().split(',');
      const required = ['title', 'description', 'priority'];
      const missing = required.filter(h => !headers.some(header => header.trim().includes(h)));
      
      setTimeout(() => {
        if (missing.length > 0) {
          addLog(`[ERROR] Schema mismatch. Missing headers: ${missing.join(', ')}`);
          setUploadState('idle');
          alert(`Invalid CSV. Missing required headers: ${missing.join(', ')}`);
        } else {
          addLog('[PARSER] Schema validated. Neural alignment complete.');
          setUploadState('ready');
        }
      }, 1200);
    };
    reader.readAsText(file);
  };

  const startIngest = async () => {
    setUploadState('processing');
    setStage(1);
    addLog('[AUTH] Verified sovereign neural signature.');
    addLog('[INGEST] Pipeline opening. Streaming units to Vault-L8...');
    
    // Simulate polling
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUploadState('complete');
        setStage(4);
        setJobStats({ success: 942, failed: 58, total: 1000 });
        setErrors([
          { row: 42, cause: 'Missing identity token', hint: 'Field "title" exceeds 200 chars' },
          { row: 118, cause: 'Invalid priority tier', hint: 'Expected P0-P3, found "Urgent"' },
          { row: 502, cause: 'DB Conflict', hint: 'Duplicate sequence detected' }
        ]);
        addLog('[VAULT] Ingress complete. 94.2% yield reached.');
        addLog('[SYSTEM] Log generated. Job closed.');
      }
      setProgress(currentProgress);
      if (currentProgress > 25 && stage === 1) setStage(2);
      if (currentProgress > 60 && stage === 2) setStage(3);
    }, 800);
  };

  return (
    <AppLayout activePage="Complaints">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12 text-text-primary">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra Ingest Portal</p>
             <h1 className="text-3xl font-extrabold tracking-tight">Bulk Ingress Protocol</h1>
          </div>
          <div className="flex gap-4">
             {uploadState !== 'idle' && (
               <button onClick={() => window.location.reload()} className="flex items-center gap-3 px-6 py-3 border border-border-subtle rounded-2xl text-[10px] font-black uppercase text-text-muted hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-sm">
                  <Trash2 size={16} />
                  Abort Ingest
               </button>
             )}
             <button onClick={() => navigate('/complaints')} className="btn-primary flex items-center gap-3 px-8 shadow-xl shadow-brand-primary/20">
                Unit Management
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
           
           {/* Progress Tracking (8 cols) */}
           <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <AnimatePresence mode="wait">
                {uploadState === 'idle' || uploadState === 'ready' || uploadState === 'validating' ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="card min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 relative group overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                     
                     <div className="text-center space-y-6 relative z-10 px-10">
                        <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto border border-brand-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                           {uploadState === 'validating' ? <RefreshCcw className="text-brand-primary animate-spin" size={40} /> : <CloudUpload className="text-brand-primary" size={40} />}
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black tracking-tight uppercase">{uploadState === 'validating' ? 'Analyzing Payload...' : 'Initiate Secure Transfer'}</h3>
                           <p className="text-sm text-text-muted font-medium max-w-sm mx-auto leading-relaxed">
                              Drop your CSV ledger here or click to scan. Protocol requires <strong>RFC-4180</strong> compliance with <strong>SHA-256</strong> headers.
                           </p>
                        </div>
                        <div className="flex gap-4 pt-4 justify-center">
                           <button 
                             onClick={() => fileInputRef.current.click()}
                             className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                               uploadState === 'ready' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-app-bg border border-border-subtle text-text-primary hover:border-brand-primary'
                             }`}
                           >
                              {uploadState === 'ready' ? 'Payload Verified' : 'Scan File'}
                           </button>
                           {uploadState === 'ready' && (
                             <button onClick={startIngest} className="btn-primary px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 flex items-center gap-3">
                                Start Ingress
                                <Zap size={16} fill="white" />
                             </button>
                           )}
                        </div>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                     <div className="card space-y-10">
                        <div className="flex justify-between items-center border-b border-border-subtle -m-6 p-6 mb-2 bg-app-bg/10">
                           <div className="flex items-center gap-3">
                              <CloudUpload size={22} className="text-brand-primary" />
                              <h3 className="text-sm font-black tracking-tight uppercase">Active Ingress Sequence</h3>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
                              <Zap size={12} fill="currentColor" className="animate-pulse" />
                              NODE_TS_INGEST_86 — SYNC: OK
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                           <ProgressStage title="Schema Scan" status={stage > 1 ? 'complete' : 'loading'} active={stage === 1} />
                           <ProgressStage title="Neural Link" status={stage > 2 ? 'complete' : stage === 2 ? 'loading' : 'pending'} active={stage === 2} />
                           <ProgressStage title="Deduplication" status={stage > 3 ? 'complete' : stage === 3 ? 'loading' : 'pending'} active={stage === 3} />
                           <ProgressStage title="Vault Committal" status={stage === 4 ? 'complete' : stage === 4 ? 'loading' : 'pending'} active={stage === 4} />
                        </div>

                        <div className="space-y-6 pt-6">
                           <div className="flex justify-between items-end px-1">
                              <div className="space-y-1">
                                 <p className="text-tiny uppercase tracking-[0.2em] text-text-muted font-black italic">Progression Matrix</p>
                                 <h4 className="text-xl font-black text-text-primary tracking-tight">Streaming Encrypted Units</h4>
                              </div>
                              <div className="text-right">
                                 <span className="text-brand-primary font-black text-3xl tracking-tighter italic">{Math.round(progress)}%</span>
                                 <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Payload: {file?.name}</p>
                              </div>
                           </div>
                           <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-1 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-brand-primary to-brand-hover rounded-full shadow-[0_0_20px_var(--primary)]"
                                transition={{ duration: 0.5 }}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Job Summary / Errors (Visible on Complete) */}
                     {uploadState === 'complete' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-6 !border-rose-500/10">
                           <div className="flex justify-between items-center">
                              <h3 className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-3">
                                 <AlertCircle size={18} />
                                 Ingress Anomaly Report
                              </h3>
                              <button className="text-[10px] font-black uppercase text-text-muted hover:text-white flex items-center gap-2">
                                 Expand Details <ChevronDown size={14} />
                              </button>
                           </div>
                           
                           <div className="space-y-4">
                              {errors.map((err, i) => (
                                <div key={i} className="flex gap-6 p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10 group hover:border-rose-500/30 transition-all">
                                   <div className="text-rose-500 font-mono text-xs font-black">ROW_{err.row}</div>
                                   <div className="flex-1">
                                      <p className="text-xs font-bold text-rose-100 uppercase tracking-tight">{err.cause}</p>
                                      <p className="text-[10px] text-rose-500/60 font-medium mt-1 italic">{err.hint}</p>
                                   </div>
                                   <button className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <RefreshCcw size={14} />
                                   </button>
                                </div>
                              ))}
                           </div>

                           <div className="flex gap-4 pt-4 border-t border-border-subtle mt-6">
                              <button className="flex-1 py-4 bg-app-bg border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all flex items-center justify-center gap-3">
                                 <Download size={16} /> Export Failure Ledger
                              </button>
                              <button onClick={() => navigate('/complaints')} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                                 <Eye size={16} /> View Successfully Ingested Units ({jobStats.success})
                              </button>
                           </div>
                        </motion.div>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Console Logs */}
              <div className="card !p-0 bg-slate-950 border-slate-800 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden group">
                 <div className="p-5 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <TerminalIcon size={16} className="text-brand-primary" />
                       <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">Sentinel Diagnostic Stream</p>
                    </div>
                    <div className="flex gap-1.5 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[9px] text-emerald-500 font-bold shadow-inner">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-0.5" />
                       PIPELINE: ACTIVE
                    </div>
                 </div>
                 <div className="p-8 font-mono text-xs text-slate-500 space-y-2.5 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 selection:bg-brand-primary/20 bg-[#020617]">
                    {logs.map((log, i) => (
                      <div key={i} className={`flex gap-6 group/line transition-colors ${log.includes('ERROR') ? 'text-rose-500' : log.includes('SUCCESS') || log.includes('OK') ? 'text-emerald-500' : ''}`}>
                         <span className="opacity-10 select-none w-10 text-right">{i + 1}</span>
                         <span className="group-hover/line:text-slate-300 transition-colors leading-relaxed">{log}</span>
                      </div>
                    ))}
                    <div className="w-1.5 h-4 bg-brand-primary animate-pulse inline-block ml-10 mt-1" />
                 </div>
              </div>
           </div>

           {/* Stats Sidebar (4 cols) */}
           <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="card space-y-8 !bg-[#0F172A]/40 backdrop-blur-3xl">
                 <div className="flex items-center gap-3 border-b border-border-subtle -m-6 p-6 mb-2 bg-slate-900/20">
                    <Database size={22} className="text-brand-primary" />
                    <h3 className="text-sm font-black tracking-widest uppercase">Ingress Insights</h3>
                 </div>
                 <div className="space-y-4 pt-4">
                    {[
                      { l: 'Target Units', v: jobStats.total || (file ? '1,000' : '0'), i: FileText, c: 'text-brand-primary' },
                      { l: 'Identity Yield', v: jobStats.success || (file ? '—' : '0'), i: Cpu, c: 'text-emerald-500' },
                      { l: 'Security Rejections', v: jobStats.failed || (file ? '—' : '0'), i: ShieldCheck, c: 'text-rose-500' },
                    ].map(s => (
                      <div key={s.l} className="flex justify-between items-center p-5 bg-slate-950/50 rounded-[32px] border border-white/5 group hover:border-brand-primary/20 transition-all shadow-inner">
                         <div className="flex items-center gap-5 text-text-primary">
                            <div className={`p-3 rounded-2xl bg-slate-900 border border-white/5 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 ${s.c}`}><s.i size={20} /></div>
                            <span className="text-xs font-black uppercase tracking-tight opacity-70">{s.l}</span>
                         </div>
                         <span className={`font-black text-2xl tracking-tighter ${s.c}`}>{s.v}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="card bg-brand-primary text-white p-0 overflow-hidden shadow-2xl shadow-brand-primary/30 relative group">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
                 <div className="p-8 space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black tracking-[0.3em] uppercase opacity-80 italic">Encryption Link</h3>
                       <ShieldCheck size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Protocol Node SHA</p>
                       <p className="text-sm font-mono font-black tracking-tighter bg-black/20 p-3 rounded-xl border border-white/10 break-all select-all">EF20-112B-AA88-FB12-66C2-D882</p>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                       <p className="text-xs leading-relaxed italic opacity-90 font-medium">
                          "Metadata enrichment uses <strong>Neural-8</strong> clustering. All units are anonymized before persistent committal."
                       </p>
                    </div>
                 </div>
              </div>

              {uploadState === 'processing' && (
                <div className="card !p-0 overflow-hidden bg-app-bg border-dashed text-text-primary flex items-center gap-5 p-6 border-amber-500/30 group">
                   <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 transition-all group-hover:bg-amber-500/20 group-hover:scale-110 shadow-lg shadow-amber-500/5"><Clock size={32} strokeWidth={2.5} className="animate-spin-slow" /></div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] leading-none text-amber-600/60">Estimated Yield</p>
                      <p className="text-2xl font-black tracking-tighter mt-1.5 italic">14m 22s <span className="text-[10px] uppercase tracking-normal opacity-40 font-bold not-italic">REMAINING</span></p>
                   </div>
                </div>
              )}
           </div>

        </div>
      </div>
    </AppLayout>
  );
};

// Internal style helper
const RefreshCcw = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>
  </svg>
);

export default BatchUpload;
