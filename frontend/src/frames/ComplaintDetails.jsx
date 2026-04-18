import React from 'react';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import { 
  History, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  FileText,
  ExternalLink,
  ChevronRight,
  Send,
  MoreVertical,
  Paperclip
} from 'lucide-react';

const TimelineEvent = ({ title, time, user, active, last }) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full border-2 border-card-bg z-10 ${active ? 'bg-brand-primary' : 'bg-border-subtle group-hover:bg-brand-subtle'}`} />
      {!last && <div className="w-0.5 flex-1 bg-border-subtle my-1" />}
    </div>
    <div className="pb-8 flex-1">
      <div className="flex justify-between items-start mb-1">
         <h4 className={`text-xs font-bold leading-none ${active ? 'text-text-primary' : 'text-text-muted'}`}>{title}</h4>
         <span className="text-[10px] font-mono text-text-muted">{time}</span>
      </div>
      <p className="text-[10px] text-text-muted">Agent: {user}</p>
    </div>
  </div>
);

const MetadataItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 p-3 bg-app-bg/50 rounded-xl border border-border-subtle">
    <div className="p-2 bg-brand-subtle rounded-lg text-brand-primary">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const ComplaintDetails = ({ onNext }) => {
  return (
    <AppLayout activePage="Complaints">
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <div className="px-2 py-0.5 bg-brand-subtle text-brand-primary rounded text-[10px] font-bold">CMP-821</div>
               <div className="px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[10px] font-bold">CRITICAL BR-01</div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Velocity Corp: Screen Failure Leak</h1>
            <p className="text-text-secondary">Opened 2.4h ago • Last active 12m ago • Vault Node: SF-X1</p>
          </div>
          <div className="flex gap-3">
             <button className="p-2 border border-border-subtle rounded-lg hover:bg-app-bg transition-all">
                <MoreVertical size={18} className="text-text-muted" />
             </button>
             <button onClick={onNext} className="btn-primary flex items-center gap-2">
                Initiate Resolution
                <ChevronRight size={18} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Main Context (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
             <div className="card space-y-8">
                <div className="flex items-center justify-between border-b border-border-subtle -m-6 p-4 mb-2 bg-app-bg/50">
                   <div className="flex items-center gap-3">
                      <FileText size={18} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Case Manifesto</h3>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-bold text-brand-primary hover:underline">
                      <ExternalLink size={12} />
                      AUDIT FULL SOURCE
                   </button>
                </div>

                <div className="space-y-6 pt-4">
                   <div className="prose dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-4">
                      <p>
                        Client reports a catastrophic failure in the "Tark-X" model display module. 
                        The primary issue is a perceived <span className="text-rose-500 font-bold">liquid leak</span> 
                        behind the primary substrate, accompanied by an ozone-like odor.
                      </p>
                      <p className="bg-app-bg p-4 rounded-xl border border-dashed border-border-subtle font-mono text-xs">
                         "The display appears to be melting from the inside out. I've disconnected power and 
                         contained the unit in a fire-safe cabinet."
                      </p>
                   </div>

                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetadataItem label="Category" value="Hardware" icon={ShieldAlert} />
                      <MetadataItem label="Priority" value="High (P0)" icon={Clock} />
                      <MetadataItem label="Assigned" value="Alex Rivera" icon={User} />
                      <MetadataItem label="Sentiment" value="Urgent/Alarmed" icon={ShieldAlert} />
                   </div>
                </div>
             </div>

             {/* Communication Hub */}
             <div className="card space-y-6">
                <div className="flex items-center gap-3 mb-4">
                   <MessageSquare size={18} className="text-brand-primary" />
                   <h3 className="font-bold tracking-tight">Resolution Center</h3>
                </div>
                
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white text-xs font-bold">AR</div>
                      <div className="flex-1 bg-brand-subtle p-4 rounded-2xl rounded-tl-sm border border-brand-primary/10">
                         <p className="text-sm text-text-primary">Safety protocol initiated. Client advised on containment strategies. Escalated to Floor Mngr.</p>
                         <span className="text-[10px] text-brand-primary font-bold block pt-2">8:12 AM • INTERNAL DISCOURSE</span>
                      </div>
                   </div>
                   <div className="flex flex-row-reverse gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-text-primary text-xs font-bold shrink-0">JS</div>
                      <div className="flex-1 bg-app-bg p-4 rounded-2xl rounded-tr-sm border border-border-subtle">
                         <p className="text-sm text-text-secondary italic">"Will the containment affect the warranty status of the secondary units?"</p>
                         <span className="text-[10px] text-text-muted font-bold block pt-2 uppercase">8:45 AM • CUSTOMER INQUIRY</span>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                   <div className="relative">
                      <textarea 
                        placeholder="Draft secure response or manual internal note..."
                        className="w-full bg-input-bg border border-border-subtle rounded-2xl p-4 pr-32 text-sm focus:outline-none focus:border-brand-primary transition-all min-h-[100px] resize-none"
                      />
                      <div className="absolute bottom-4 right-4 flex gap-3">
                         <button className="p-2 text-text-muted hover:text-brand-primary"><Paperclip size={18} /></button>
                         <button className="bg-brand-primary text-white p-2 px-6 rounded-xl hover:bg-brand-hover transition-all flex items-center gap-2 group shadow-lg shadow-brand-primary/20">
                            <Send size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Context Sidebar (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="card space-y-6">
                <div className="flex items-center gap-3">
                   <History size={18} className="text-brand-primary" />
                   <h3 className="text-sm font-bold tracking-tight uppercase">Operations Ledger</h3>
                </div>
                <div className="pt-2">
                   <TimelineEvent title="Neural Extraction Success" time="2h ago" user="Tark-Bot" active={false} />
                   <TimelineEvent title="Case Assigned to Hub-SF" time="1.8h ago" user="Global Routing" active={false} />
                   <TimelineEvent title="Initial Triage Completed" time="1.2h ago" user="Alex Rivera" active={true} />
                   <TimelineEvent title="Awaiting Manager Appraisal" time="Now" user="System Console" active={true} last={true} />
                </div>
             </div>

             <div className="card bg-brand-primary text-white space-y-4 shadow-xl shadow-brand-primary/20">
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={24} />
                   <h3 className="font-bold tracking-tight text-lg">Resolution Status</h3>
                </div>
                <div className="space-y-4 pt-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                      <span>Phase: Investigation</span>
                      <span>42% Progress</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[42%] shadow-[0_0_10px_white]" />
                   </div>
                   <button className="w-full py-3 bg-white text-brand-primary rounded-xl font-bold text-xs hover:bg-white/90 transition-all uppercase tracking-widest mt-2">
                      Mark as Finalized
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ComplaintDetails;
