import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import AppLayout from '../components/AppLayout';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  MoreHorizontal, 
  Download, 
  ArrowUpRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

const Badge = ({ children, status }) => {
  const styles = {
    'OPEN': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'CLASSIFIED': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    'IN_PROGRESS': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'RESOLVED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'P0': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'P1': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'P2': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {children}
    </span>
  );
};

const QueueView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 });
  const [stats, setStats] = useState({ p0Backlog: 14, avgTriage: '0.8h', autonomous: '82%', total: 24 });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, categoryFilter, pagination.page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let endpoint = '/complaints?';
      if (statusFilter) endpoint += `status=${statusFilter}&`;
      if (categoryFilter) endpoint += `category=${categoryFilter}&`;
      if (searchTerm) endpoint += `search=${encodeURIComponent(searchTerm)}&`;
      endpoint += `page=${pagination.page}&limit=${pagination.limit}`;
      
      const data = await api.get(endpoint);
      setComplaints(Array.isArray(data) ? data : []);
      
      // Update stats (mock for now)
      setStats({
        p0Backlog: data.filter(c => c.priority === 'P0').length || 0,
        avgTriage: '0.8h',
        autonomous: '82%',
        total: data.length || 0
      });
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? '' : status);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleCategoryFilter = (cat) => {
    setCategoryFilter(cat === categoryFilter ? '' : cat);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPagination(p => ({ ...p, page: newPage }));
    }
  };

  const formatId = (id) => `CMP-${String(id).padStart(3, '0')}`;
  
  const getStatusLabel = (status) => {
    const map = {
      'new': 'Priority P0',
      'OPEN': 'Open',
      'CLASSIFIED': 'Classified',
      'IN_PROGRESS': 'In Progress',
      'resolved': 'Resolved',
      'RESOLVED': 'Resolved'
    };
    return map[status] || status;
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setPagination(p => ({ ...p, page: 1 }));
  };

  const hasActiveFilters = searchTerm || statusFilter || categoryFilter;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Master Complaint Ledger</h1>
            <p className="text-text-secondary">Central command for high-velocity complaint triage and audit logs</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => {
               // Export functionality - in real app, call API
               const csv = complaints.map(c => `${c.id},${c.title},${c.status},${c.priority}`).join('\n');
               const blob = new Blob([csv], { type: 'text/csv' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = 'complaints.csv';
               a.click();
             }} className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary transition-all shadow-sm">
                <Download size={16} />
                Export CSV
             </button>
             <button onClick={() => navigate('/batch')} className="btn-primary flex items-center gap-2">
                Batch Verification
                <ArrowUpRight size={18} />
             </button>
          </div>
        </header>

        {/* Global Filter Bar */}
        <div className="card !p-3 flex items-center gap-4 bg-app-bg/50 border-dashed flex-wrap">
           <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Query by case ID, client name, or neural fingerprint..."
                className="w-full bg-card-bg border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
           </div>
           <div className="h-8 w-px bg-border-subtle hidden lg:block" />
           <div className="flex gap-2 flex-wrap">
              <button 
                onClick={handleCategoryFilter}
                className={`flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-xs font-bold transition-all ${categoryFilter ? 'text-brand-primary border-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
              >
                 <Filter size={14} />
                 {categoryFilter || 'ALL CATEGORIES'}
              </button>
              {['OPEN', 'CLASSIFIED', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                <button 
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${statusFilter === status ? 'bg-brand-primary text-white border-brand-primary' : 'bg-card-bg border-border-subtle text-text-muted hover:text-text-primary'}`}
                >
                  {status}
                </button>
              ))}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 px-2 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                  <X size={14} /> Clear
                </button>
              )}
           </div>
        </div>

        {/* Ledger Table */}
        <div className="card p-0 overflow-hidden">
           {loading && (
             <div className="flex items-center justify-center py-20">
               <Loader2 size={32} className="animate-spin text-brand-primary" />
             </div>
           )}
           
           {!loading && complaints.length === 0 && (
             <div className="text-center py-12">
               <AlertCircle size={48} className="mx-auto text-text-muted mb-4" />
               <p className="text-text-muted">No complaints found</p>
               {hasActiveFilters && (
                 <button onClick={clearFilters} className="btn-primary mt-4">
                   Clear Filters
                 </button>
               )}
             </div>
           )}

           {!loading && complaints.length > 0 && (
             <>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-app-bg/80 border-b border-border-subtle">
                        <tr>
                           <th className="p-4 text-tiny">Case Identity</th>
                           <th className="p-4 text-tiny">Subject & Insight</th>
                           <th className="p-4 text-tiny">Category</th>
                           <th className="p-4 text-tiny">System Status</th>
                           <th className="p-4 text-tiny">Time Delta</th>
                           <th className="p-4"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border-subtle">
                        {complaints.map((row) => (
                          <tr key={row.id} className="hover:bg-brand-subtle/30 transition-colors group cursor-pointer" onClick={() => navigate(`/complaint/${row.id}`)}>
                             <td className="p-4">
                                <span className="font-mono text-xs font-bold text-brand-primary">{formatId(row.id)}</span>
                                <p className="text-xs font-semibold text-text-primary pt-1">Client #{row.assigned_to || 'System'}</p>
                             </td>
                             <td className="p-4 max-w-md">
                                <div className="flex flex-col gap-1">
                                   <span className="text-sm font-semibold truncate group-hover:text-brand-primary transition-colors">{row.title || 'Untitled'}</span>
                                   <span className="text-[10px] text-text-muted truncate">{row.description?.substring(0, 50)}</span>
                                </div>
                             </td>
                             <td className="p-4">
                                <span className="text-xs font-bold text-text-muted uppercase">{row.category || 'Uncategorized'}</span>
                             </td>
                             <td className="p-4">
                                <div className="flex gap-2">
                                   <Badge status={row.status}>{getStatusLabel(row.status)}</Badge>
                                   <Badge status={row.priority}>{row.priority || 'P2'}</Badge>
                                </div>
                             </td>
                             <td className="p-4">
                                <span className="text-[10px] font-mono text-text-muted flex items-center gap-2">
                                   <Clock size={12} />
                                   {getTimeAgo(row.created_at)}
                                </span>
                             </td>
                             <td className="p-4 text-right">
                                <button onClick={(e) => { e.stopPropagation(); navigate(`/complaint/${row.id}`); }} className="p-2 text-text-muted hover:text-text-primary group-hover:bg-card-bg rounded-lg transition-all">
                                   <MoreHorizontal size={18} />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Pagination */}
               <footer className="px-6 py-4 bg-app-bg/50 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">
                    Showing <span className="text-text-primary font-bold">{(pagination.page - 1) * pagination.limit + 1}</span> - {Math.min(pagination.page * pagination.limit, complaints.length)} of {complaints.length} records
                  </span>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => handlePageChange(pagination.page - 1)}
                       disabled={pagination.page === 1}
                       className="p-2 border border-border-subtle rounded-lg text-text-muted hover:bg-card-bg disabled:opacity-20"
                     >
                        <ChevronLeft size={18} />
                     </button>
                     <span className="px-3 py-1 text-sm font-bold text-text-primary">Page {pagination.page}</span>
                     <button 
                       onClick={() => handlePageChange(pagination.page + 1)}
                       disabled={complaints.length < pagination.limit}
                       className="p-2 border border-border-subtle rounded-lg text-text-muted hover:bg-card-bg disabled:opacity-20"
                     >
                        <ChevronRight size={18} />
                     </button>
                  </div>
               </footer>
             </>
           )}
        </div>

        {/* Global Summary Statistics Mini-grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
              { l: 'P0 BACKLOG', v: stats.p0Backlog, i: ShieldAlert, c: 'text-rose-500' },
              { l: 'AVG TRIAGE', v: stats.avgTriage, i: Clock, c: 'text-brand-primary' },
              { l: 'AUTONOMOUS', v: stats.autonomous, i: CheckCircle2, c: 'text-emerald-500' },
              { l: 'TOTAL FLOW', v: stats.total, i: AlertCircle, c: 'text-text-muted' },
           ].map(s => (
             <div key={s.l} className="card !p-4 flex items-center gap-4">
                <s.i size={18} className={s.c} />
                <div>
                   <p className="text-[9px] font-black tracking-widest text-text-muted uppercase leading-tight">{s.l}</p>
                   <p className="text-xl font-bold text-text-primary">{s.v}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
  );
};

export default QueueView;
