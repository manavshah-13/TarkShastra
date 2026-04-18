import React from 'react';
import { motion } from 'framer-motion';
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
  Fingerprint
} from 'lucide-react';

const StatusStep = ({ title, status, desc, active, last }) => (
  <div className="flex gap-6 group">
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        status === 'complete' ? 'bg-emerald-500 text-white' : 
        active ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30 ring-4 ring-brand-primary/10' : 
        'bg-app-bg text-text-muted border border-border-subtle'
      }`}>
        {status === 'complete' ? <CheckCircle2 size={24} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
      </div>
      {!last && <div className={`w-1 flex-1 my-3 rounded-full ${status === 'complete' ? 'bg-emerald-500' : 'bg-border-subtle'}`} />}
    </div>
    <div className="pb-10 flex-1">
      <div className="flex justify-between items-start mb-2">
         <h4 className={`text-lg font-extrabold tracking-tight ${active ? 'text-text-primary' : 'text-text-muted'}`}>{title}</h4>
         <span className="text-[10px] font-mono font-black text-text-muted bg-app-bg px-2 py-1 rounded border border-border-subtle uppercase">Node: SF-X1</span>
      </div>
      <p className={`text-sm leading-relaxed ${active ? 'text-text-secondary' : 'text-text-muted opacity-60'}`}>{desc}</p>
      {active && (
         <div className="mt-4 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex items-center justify-between group/inner cursor-pointer hover:bg-brand-primary/10 transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">View Internal Audit Log</span>
            <ArrowRight size={14} className="text-brand-primary group-hover/inner:translate-x-1 transition-transform" />
         </div>
      )}
    </div>
  </div>
);

const PublicTracker = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* Visual Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <header className="h-20 bg-card-bg/80 backdrop-blur-xl border-b border-border-subtle flex items-center justify-between px-8 lg:px-24 sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">T</div>
           <span className="font-black text-xl tracking-tighter">TarkShastra Portal</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer font-bold text-xs uppercase tracking-widest group">
              <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" /> Support Center
           </div>
           <button onClick={onNext} className="btn-primary px-8 flex items-center gap-2 group">
              Neural Sync
              <Zap size={16} fill="white" className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-12 gap-16">
           
           {/* Left: Search & Summary (5 cols) */}
           <div className="col-span-12 lg:col-span-5 space-y-10">
              <div className="space-y-4">
                 <h1 className="text-5xl font-black tracking-tighter leading-[0.9] text-text-primary uppercase">
                   Track Your <span className="text-brand-primary italic">Complaint</span> Resolution
                 </h1>
                 <p className="text-lg text-text-secondary leading-relaxed font-medium opacity-80">
                   Enter your unique neural identifier to access real-time status updates from our immutable operations ledger.
                 </p>
              </div>

              <div className="space-y-4 pt-4">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-brand-primary blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity" />
                    <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder="ENTER NEURAL ID: TS-XXXX-XXXX"
                      className="w-full text-xl font-mono font-black py-6 pl-16 pr-6 bg-card-bg border-4 border-border-subtle rounded-3xl focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-2xl shadow-brand-primary/5 uppercase placeholder:lowercase placeholder:font-sans placeholder:font-bold placeholder:opacity-40"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-brand-primary text-white rounded-2xl hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
                       <ChevronRight size={24} strokeWidth={3} />
                    </button>
                 </div>
                 <div className="flex items-center justify-center gap-6 px-4 py-3 bg-app-bg rounded-2xl border border-border-subtle font-mono text-[10px] text-text-muted font-bold tracking-widest">
                    <span className="flex items-center gap-2 text-emerald-500"><ShieldCheck size={14} /> SOC-2 COMPLIANT</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
                    <span className="flex items-center gap-2 text-brand-primary"><Activity size={14} /> 99.9% UPTIME</span>
                 </div>
              </div>

              <div className="card !bg-brand-primary !text-white overflow-hidden shadow-2xl shadow-brand-primary/30 relative group grayscale hover:grayscale-0 transition-all duration-700">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                 <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                 <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xs font-black tracking-widest uppercase opacity-80">Security Protocol Alpha</h3>
                       <ExternalLink size={20} className="opacity-60" />
                    </div>
                    <div className="space-y-4">
                       <p className="text-2xl font-black italic tracking-tighter">"Privacy is our primary neural logic."</p>
                       <p className="text-xs font-medium leading-relaxed opacity-90">
                         All status queries are processed through a zero-knowledge bridge, ensuring your request remains 
                         invisible to third-party entities and monitoring arrays.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Timeline Visualization (7 cols) */}
           <div className="col-span-12 lg:col-span-7">
              <div className="card !p-12 !rounded-[40px] shadow-2xl shadow-slate-900/10 border-border-subtle/50 relative">
                 <div className="absolute top-10 right-10 flex flex-col items-end">
                    <span className="text-[10px] font-black tracking-[0.3em] font-mono text-text-muted uppercase mb-1">Last Sync</span>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       14s ago
                    </div>
                 </div>

                 <div className="space-y-2 mb-16">
                    <h2 className="text-3xl font-black tracking-tighter text-text-primary">Operational Sequence</h2>
                    <p className="text-text-muted font-bold text-sm">Status mapping for identity <span className="text-brand-primary font-mono select-all">TS-882-9901</span></p>
                 </div>

                 <div className="relative pl-2">
                    <StatusStep 
                      title="Ingress Extraction" 
                      status="complete" 
                      desc="Neural models successfully decoded the payload and mapped sentiment entities to the Vault ledger." 
                    />
                    <StatusStep 
                      title="Route Verification" 
                      status="complete" 
                      desc="The complaint has been passed through the global routing array and assigned to appropriate authority nodes." 
                    />
                    <StatusStep 
                      title="Neural Triage" 
                      active={true} 
                      desc="Currently analyzing internal discourse and evidence artifacts to propose a high-confidence resolution strategy." 
                    />
                    <StatusStep 
                      title="Final Committal" 
                      status="pending" 
                      desc="Awaiting final manager verification before deploying the resolution audit to the client hub." 
                      last={true}
                    />
                 </div>
              </div>
           </div>

        </div>
      </main>

      <footer className="mt-auto py-12 bg-app-bg border-t border-border-subtle px-8 lg:px-24">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-text-muted">
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest">&copy; 2026 TARKSHASTRA SYSTEMS</span>
              <span className="w-1 h-1 rounded-full bg-border-subtle" />
              <span className="text-[10px] font-bold">ENCRYPTED END-TO-END</span>
           </div>
           <div className="flex gap-8">
              {['Security', 'Status', 'Protocol', 'Manifesto'].map(item => (
                <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors">{item}</a>
              ))}
           </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicTracker;
