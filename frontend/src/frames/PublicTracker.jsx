import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap,
  Fingerprint,
  Download,
  Printer,
  FileText,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

const StatusStep = ({ title, status, desc, active, last }) => (
  <div className="flex gap-8 group">
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
        status === 'complete' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
        active ? 'bg-brand-primary text-white shadow-2xl shadow-brand-primary/40 ring-4 ring-brand-primary/10 scale-110' : 
        'bg-[#0F172A] text-slate-600 border border-slate-800'
      }`}>
        {status === 'complete' ? <CheckCircle2 size={24} strokeWidth={3} /> : <div className={`w-2 h-2 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-current'}`} />}
      </div>
      {!last && <div className={`w-1 flex-1 my-4 rounded-full ${status === 'complete' ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
    </div>
    <div className="pb-12 flex-1 pt-1">
      <div className="flex justify-between items-center mb-2">
         <h4 className={`text-xl font-black tracking-tight ${active ? 'text-white' : status === 'complete' ? 'text-slate-200' : 'text-slate-500'}`}>{title}</h4>
         {status === 'complete' && <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Committal Verified</span>}
      </div>
      <p className={`text-sm leading-relaxed font-medium ${active ? 'text-slate-300' : 'text-slate-500'}`}>{desc}</p>
      {active && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 bg-brand-primary/10 rounded-[28px] border border-brand-primary/20 flex items-center justify-between group/inner cursor-pointer hover:bg-brand-primary/20 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary"><Activity size={18} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Analyzing Operational Discourse</span>
            </div>
            <ArrowRight size={16} className="text-brand-primary group-hover/inner:translate-x-1 transition-transform" />
         </motion.div>
      )}
    </div>
  </div>
);

const PublicTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSearched(true);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-brand-primary selection:text-white pb-print-none">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .card { border: 1px solid #000 !important; color: #000 !important; box-shadow: none !important; }
          body { background: white !important; color: black !important; }
          .text-brand-primary { color: #000 !important; }
          .bg-brand-primary { background: #000 !important; color: white !important; }
        }
      `}</style>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40 no-print">
         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-primary/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <header className="h-24 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 lg:px-24 sticky top-0 z-50 no-print">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-brand-primary/30">T</div>
           <div>
              <span className="font-black text-2xl tracking-tighter block leading-none">TarkShastra</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Public Portal</span>
           </div>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer font-black text-[10px] uppercase tracking-widest group">
              <HelpCircle size={18} className="group-hover:rotate-12 transition-transform" /> Support Center
           </div>
           <button onClick={() => window.location.href = '/login'} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Staff Login</button>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-12 gap-16">
           
           {/* Search Section */}
           <div className={`col-span-12 lg:col-span-5 space-y-12 no-print ${isSearched ? 'lg:col-span-5' : 'lg:col-span-12 lg:max-w-3xl lg:mx-auto lg:text-center'}`}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <h1 className="text-6xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                   Track Your <span className="text-brand-primary not-italic">Ledger</span> Activity
                 </h1>
                 <p className="text-xl text-slate-400 leading-relaxed font-medium">
                   Access real-time operational status from our immutable blockchain-verified complaint matrix.
                 </p>
              </motion.div>

              <form onSubmit={handleSearch} className="space-y-6 pt-4 relative">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-brand-primary blur-3xl opacity-0 group-focus-within:opacity-20 transition-all duration-700" />
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={32} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                      placeholder="TS-XXXX-XXXX-XXXX"
                      className="w-full text-3xl font-mono font-black py-10 pl-20 pr-10 bg-[#0F172A] border-4 border-slate-800 rounded-[40px] focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] uppercase placeholder:text-slate-800"
                    />
                    <button 
                      type="submit"
                      disabled={loading}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-5 bg-brand-primary text-white rounded-3xl hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-primary/40 disabled:opacity-50"
                    >
                       {loading ? <RefreshCcw className="animate-spin" size={28} /> : <ChevronRight size={28} strokeWidth={4} />}
                    </button>
                 </div>
                 <div className="flex items-center justify-center lg:justify-start gap-8 px-8 py-5 bg-[#0F172A]/50 rounded-[32px] border border-white/5 font-mono text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">
                    <span className="flex items-center gap-3 text-emerald-500"><ShieldCheck size={16} /> Secure_Bridge</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="flex items-center gap-3"><Clock size={16} /> Sync: 22ms</span>
                 </div>
              </form>

              {!isSearched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-8 pt-8">
                   <div className="p-8 bg-[#0F172A]/50 rounded-[40px] border border-white/5 space-y-4">
                      <Zap size={32} className="text-brand-primary" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Speed</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Resolution modeling commences within 14ms of ingress extraction.</p>
                   </div>
                   <div className="p-8 bg-[#0F172A]/50 rounded-[40px] border border-white/5 space-y-4">
                      <ShieldCheck size={32} className="text-emerald-500" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Zero Leak Policy</h3>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed">Your data is shredded and tokenized. We only track operational outcomes.</p>
                   </div>
                </motion.div>
              )}
           </div>

           {/* Results Timeline */}
           <AnimatePresence>
             {isSearched && (
                <motion.div 
                  initial={{ opacity: 0, x: 50 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="col-span-12 lg:col-span-7"
                >
                   <div className="card !p-12 !rounded-[48px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] border-white/5 bg-[#0F172A]/60 backdrop-blur-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <Activity size={240} />
                      </div>
                      
                      <div className="flex justify-between items-start mb-20 relative z-10">
                         <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">Audit Trace</h2>
                            <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Tracking Identity: <span className="text-brand-primary select-all">{searchQuery}</span></p>
                         </div>
                         <div className="flex gap-4 no-print">
                            <button onClick={handlePrint} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Printer size={20} /></button>
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Download size={20} /></button>
                         </div>
                      </div>

                      <div className="relative pl-2 z-10">
                         <StatusStep 
                           title="Ingress Extraction" 
                           status="complete" 
                           desc="The neural model v8.4 successfully decoded your payload. Sentiment entities have been mapped to the secure Vault-L8 ledger." 
                         />
                         <StatusStep 
                           title="Sovereign Allocation" 
                           status="complete" 
                           desc="The operational unit has been verified and assigned to the primary hardware diagnostic node: HUB_SF_ALPHA." 
                         />
                         <StatusStep 
                           title="Neural Analysis" 
                           active={true} 
                           desc="Currently synthesizing internal discourse logs and diagnostic telemetry to propose a high-confidence resolution strategy." 
                         />
                         <StatusStep 
                           title="Resolution Committal" 
                           status="pending" 
                           desc="Awaiting final audit verification from the Sovereign Authority before deploying the resolution pack." 
                           last={true}
                         />
                      </div>

                      <div className="mt-12 p-8 bg-brand-primary/5 rounded-[32px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 no-print">
                         <div className="flex items-center gap-5">
                            <div className="p-4 bg-brand-primary/20 text-brand-primary rounded-[20px] shadow-xl"><FileText size={24} /></div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Automated Outcome</p>
                               <p className="text-sm font-bold text-white">Interim Status Report v4.2</p>
                            </div>
                         </div>
                         <button className="w-full md:w-auto px-8 py-3.5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all">Download Audit PDF</button>
                      </div>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>

        </div>
      </main>

      <footer className="mt-auto py-16 bg-[#0F172A]/40 border-t border-white/5 px-8 lg:px-24 no-print">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-slate-500">
           <div className="flex items-center gap-5">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-black">T</div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">&copy; 2026 TARKSHASTRA SYSTEMS</p>
                 <p className="text-[9px] font-bold mt-1 opacity-60">ENCRYPTED SOVEREIGN INFRASTRUCTURE</p>
              </div>
           </div>
           <div className="flex gap-10">
              {['Data Ethics', 'Security Audit', 'Neural Protocol', 'Legal Ledger'].map(item => (
                <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-all relative group">
                   {item}
                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all" />
                </a>
              ))}
           </div>
        </div>
      </footer>
    </div>
  );
};


export default PublicTracker;
