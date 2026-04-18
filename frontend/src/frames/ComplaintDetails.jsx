import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
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
  Paperclip,
  AlertTriangle,
  XCircle,
  Loader2,
  Check
} from 'lucide-react';

const TimelineEvent = ({ title, time, user, active, last }) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full border-2 border-card-bg z-10 ${active ? 'bg-brand-primary animate-pulse' : 'bg-border-subtle group-hover:bg-brand-subtle'}`} />
      {!last && <div className={`w-0.5 flex-1 my-1 ${active ? 'bg-brand-primary' : 'bg-border-subtle'}`} />}
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

const SLAWidget = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('normal');

  useEffect(() => {
    const calculateSLA = () => {
      const created = new Date(createdAt);
      const deadline = new Date(created.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = deadline - now;
      
      if (diff <= 0) {
        setTimeLeft('SLA BREACHED');
        setStatus('critical');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      
      if (hours < 0.5) setStatus('critical');
      else if (hours < 2) setStatus('warning');
      else setStatus('normal');
    };
    
    calculateSLA();
    const interval = setInterval(calculateSLA, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const statusColors = {
    normal: 'text-emerald-500',
    warning: 'text-amber-500',
    critical: 'text-rose-500 animate-pulse'
  };

  return (
    <div className={`flex items-center gap-2 ${statusColors[status]}`}>
      <Clock size={14} />
      <span className="font-mono text-xs font-bold">{timeLeft}</span>
    </div>
  );
};

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionType, setResolutionType] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const data = await api.get(`/complaints/${id}`);
        setComplaint(data);
        setNotes([
          { id: 1, user: 'System', text: 'Complaint received and triaged by AI', time: '2h ago', type: 'system' },
          { id: 2, user: 'Alex Rivera', text: 'Safety protocol initiated. Client advised on containment.', time: '1h ago', type: 'internal' },
        ]);
      } catch (err) {
        console.error('Failed to fetch complaint', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    try {
      const newNote = { id: Date.now(), user: 'You', text: noteText, time: 'Just now', type: 'internal' };
      setNotes([...notes, newNote]);
      setNoteText('');
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsSubmitting(true);
    try {
      // Map UI status to API enum
      const statusMap = {
        'new': 'new',
        'in_progress': 'in_progress', 
        'resolved': 'resolved'
      };
      await api.patch(`/complaints/${id}/status`, { status: statusMap[newStatus] || newStatus });
      setComplaint({ ...complaint, status: newStatus });
      setShowResolveModal(false);
      if (newStatus === 'resolved') {
        setTimeout(() => navigate('/queue'), 1500);
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = { P0: 'bg-rose-500/10 text-rose-500 border-rose-500/20', P1: 'bg-amber-500/10 text-amber-500 border-amber-500/20', P2: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    return styles[priority] || styles.P2;
  };

  const getStatusBadge = (status) => {
    const styles = { OPEN: 'bg-amber-500/10 text-amber-500 border-amber-500/20', CLASSIFIED: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20', IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20', RESOLVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    return styles[status] || styles.OPEN;
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-brand-primary" />
        </div>
    );
  }

  if (!complaint) {
    return (
        <div className="text-center py-12">
          <XCircle size={48} className="mx-auto text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary">Complaint Not Found</h2>
          <p className="text-text-muted mt-2">The requested complaint could not be found.</p>
          <button onClick={() => navigate('/queue')} className="btn-primary mt-4">Back to Queue</button>
        </div>
    );
  }

  const createdAt = complaint.created_at || new Date().toISOString();

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <div className="px-2 py-0.5 bg-brand-subtle text-brand-primary rounded text-[10px] font-bold">CMP-{complaint.id}</div>
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(complaint.priority)}`}>{complaint.priority || 'P2'}</span>
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(complaint.status)}`}>{complaint.status || 'OPEN'}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{complaint.title || 'Untitled Complaint'}</h1>
            <div className="flex items-center gap-4 text-text-secondary text-sm">
               <span>Opened {new Date(createdAt).toLocaleDateString()}</span>
               <SLAWidget createdAt={createdAt} />
            </div>
          </div>
          <div className="flex gap-3">
             <button className="p-2 border border-border-subtle rounded-lg hover:bg-app-bg transition-all"><MoreVertical size={18} className="text-text-muted" /></button>
             {complaint.status !== 'RESOLVED' && (
               <button onClick={() => setShowResolveModal(true)} className="btn-primary flex items-center gap-2">
                 <CheckCircle2 size={18} /> Resolve <ChevronRight size={18} />
               </button>
             )}
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
             <div className="card space-y-8">
                <div className="flex items-center justify-between border-b border-border-subtle -m-6 p-4 mb-2 bg-app-bg/50">
                   <div className="flex items-center gap-3">
                      <FileText size={18} className="text-brand-primary" />
                      <h3 className="text-sm font-bold tracking-tight uppercase">Case Manifesto</h3>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-bold text-brand-primary hover:underline">
                      <ExternalLink size={12} /> AUDIT FULL SOURCE
                   </button>
                </div>
                <div className="space-y-6 pt-4">
                   <div className="prose dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-4">
                      <p>{complaint.description || 'No description provided.'}</p>
                   </div>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetadataItem label="Category" value={complaint.category || 'Uncategorized'} icon={ShieldAlert} />
                      <MetadataItem label="Priority" value={complaint.priority || 'P2'} icon={Clock} />
                      <MetadataItem label="AI Confidence" value={`${Math.round((complaint.ai_confidence || 0.9) * 100)}%`} icon={CheckCircle2} />
                      <MetadataItem label="Sentiment" value="Neutral" icon={ShieldAlert} />
                   </div>
                </div>
             </div>

             <div className="card space-y-6">
                <div className="flex items-center gap-3 mb-4">
                   <MessageSquare size={18} className="text-brand-primary" />
                   <h3 className="font-bold tracking-tight">Resolution Center</h3>
                </div>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                   {notes.map((note) => (
                     <div key={note.id} className={`flex gap-4 ${note.user === 'You' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white text-xs font-bold shrink-0">{note.user === 'System' ? 'TS' : note.user.slice(0, 2).toUpperCase()}</div>
                        <div className={`flex-1 p-4 rounded-2xl border ${note.type === 'system' ? 'bg-app-bg border-dashed border-border-subtle' : note.user === 'You' ? 'bg-brand-primary/10 border-brand-primary/20' : 'bg-brand-subtle border-brand-primary/10'}`}>
                           <p className="text-sm text-text-primary">{note.text}</p>
                           <span className="text-[10px] text-text-muted font-bold block pt-2">{note.time} • {note.type === 'system' ? 'SYSTEM' : 'INTERNAL'}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="pt-6 border-t border-border-subtle">
                   <div className="relative">
                      <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Draft secure response or internal note..." className="w-full bg-input-bg border border-border-subtle rounded-2xl p-4 pr-32 text-sm focus:outline-none focus:border-brand-primary transition-all min-h-[100px] resize-none" />
                      <div className="absolute bottom-4 right-4 flex gap-3">
                         <button className="p-2 text-text-muted hover:text-brand-primary"><Paperclip size={18} /></button>
                         <button onClick={handleAddNote} disabled={!noteText.trim() || isSubmitting} className="bg-brand-primary text-white p-2 px-6 rounded-xl hover:bg-brand-hover transition-all flex items-center gap-2 group shadow-lg shadow-brand-primary/20 disabled:opacity-50">
                           {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
                         </button>
                      </div>
                   </div>
                </div>
              </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="card space-y-6">
                <div className="flex items-center gap-3">
                   <History size={18} className="text-brand-primary" />
                   <h3 className="text-sm font-bold tracking-tight uppercase">Operations Ledger</h3>
                </div>
                <div className="pt-2">
                   <TimelineEvent title="Complaint Created" time={new Date(createdAt).toLocaleTimeString()} user="System" active={true} />
                   <TimelineEvent title="AI Classification Complete" time="Recent" user="Tark-Bot" active={true} />
                   <TimelineEvent title="Assigned to Queue" time="Recent" user="Global Routing" active={true} last={true} />
                </div>
             </div>

             <div className={`card space-y-4 ${complaint.status === 'RESOLVED' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'}`}>
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={24} className={complaint.status === 'RESOLVED' ? 'text-emerald-500' : ''} />
                   <h3 className="font-bold tracking-tight text-lg">Resolution Status</h3>
                </div>
                <div className="space-y-4 pt-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                      <span>Status: {complaint.status || 'OPEN'}</span>
                      <span>{complaint.status === 'RESOLVED' ? '100%' : '42%'} Progress</span>
                   </div>
                   <div className={`h-1.5 w-full rounded-full overflow-hidden ${complaint.status === 'RESOLVED' ? 'bg-emerald-500/20' : 'bg-white/20'}`}>
                      <div className={`h-full ${complaint.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-white'} ${complaint.status === 'RESOLVED' ? 'w-full' : 'w-[42%]'}`} />
                   </div>
                   {complaint.status !== 'RESOLVED' && (
                     <button onClick={() => setShowResolveModal(true)} className={`w-full py-3 ${complaint.status === 'RESOLVED' ? 'bg-emerald-500 text-white' : 'bg-white text-brand-primary'} rounded-xl font-bold text-xs hover:bg-white/90 transition-all uppercase tracking-widest mt-2`}>
                        Mark as Finalized
                     </button>
                   )}
                </div>
             </div>
          </div>
        </div>

        {showResolveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card-bg rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-text-primary mb-4">Resolve Complaint</h3>
              <p className="text-text-secondary text-sm mb-6">Select the resolution type and confirm.</p>
              <div className="space-y-3 mb-6">
                {['Replacement', 'Refund', 'Escalated', 'No Action Required'].map((type) => (
                  <label key={type} className="flex items-center gap-3 p-3 bg-app-bg rounded-xl cursor-pointer hover:bg-brand-subtle transition-colors">
                    <input type="radio" name="resolution" value={type} checked={resolutionType === type} onChange={(e) => setResolutionType(e.target.value)} className="w-4 h-4 text-brand-primary" />
                    <span className="text-sm font-semibold text-text-primary">{type}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowResolveModal(false)} className="flex-1 py-3 border border-border-subtle rounded-xl font-bold text-sm">Cancel</button>
                <button onClick={() => handleStatusChange('RESOLVED')} disabled={!resolutionType || isSubmitting} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Confirm Resolution'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default ComplaintDetails;