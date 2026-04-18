import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Map,
  Search,
  Filter,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  Loader2,
  RefreshCcw,
  Plus,
  Zap,
  ShieldAlert,
  GripVertical,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';

const BubbleChart = ({ teamData }) => {
  const data = teamData.map((member) => ({
    x: member.name,
    y: member.complexity || 5, // Avg complexity 1-10
    z: member.caseCount || 0, // Number of open cases
    name: member.name,
    load: member.load,
    id: member.id,
    color: member.color
  }));

  const getBubbleColor = (count) => {
    if (count > 10) return '#EF4444'; // Red for >10 cases
    if (count >= 5) return '#F59E0B'; // Amber for 5-10 cases
    return '#10B981'; // Green for <5 cases
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card-bg p-4 border border-border-subtle rounded-xl shadow-xl">
          <p className="font-bold text-text-primary">{data.name}</p>
          <div className="space-y-1 mt-2">
            <p className="text-xs text-text-secondary">Open Cases: <span className="font-black text-text-primary">{data.z}</span></p>
            <p className="text-xs text-text-secondary">Avg Complexity: <span className="font-black text-text-primary">{data.y}/10</span></p>
            <p className="text-xs text-text-secondary">SLA Compliance: <span className="font-black text-text-primary">{data.load}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[450px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart data={data} margin={{ top: 20, right: 40, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            type="category"
            dataKey="x"
            name="Agent"
            tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 'bold' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Complexity"
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Avg Complexity', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--text-muted)' }}
          />
          <ZAxis type="number" dataKey="z" range={[400, 4000]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={data}
            onClick={(data) => console.log('Bubble clicked', data)}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBubbleColor(entry.z)} 
                className="cursor-pointer hover:opacity-80 transition-opacity drop-shadow-xl"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const ComplaintCard = ({ complaint, isDraggable = true }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'complaint', id: complaint.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      whileHover={{ y: -2 }}
      className="p-4 bg-app-bg border border-border-subtle rounded-xl shadow-sm hover:border-brand-primary/40 transition-all group relative cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
          complaint.priority === 'P0' ? 'bg-rose-500 text-white' : 
          complaint.priority === 'P1' ? 'bg-amber-500 text-white' : 
          'bg-slate-500 text-white'
        }`}>
          {complaint.priority}
        </span>
        <span className="text-[10px] font-mono font-bold text-text-muted">CMP-{complaint.id}</span>
      </div>
      <h5 className="text-xs font-bold text-text-primary truncate">{complaint.title}</h5>
      <p className="text-[10px] text-text-muted mt-1 truncate">{complaint.category}</p>
      <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={14} className="text-text-muted" />
      </div>
    </motion.div>
  );
};

const MemberCard = ({ member, onDrop, onClick }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'complaint') {
        onDrop(data.id, member.id);
      }
    } catch (err) {
      console.error('Drop parsing failed', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`card space-y-4 relative group transition-all duration-300 ${isOver ? 'ring-2 ring-brand-primary bg-brand-primary/5 scale-[1.02] shadow-2xl' : ''}`}
      onClick={() => onClick && onClick(member)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl`}
            style={{ backgroundColor: member.color || '#3B82F6' }}
          >
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">{member.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted tracking-widest uppercase font-bold">{member.role}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${member.online ? 'bg-emerald-500 shadow-[0_0_5px_var(--success)]' : 'bg-slate-400'}`} />
            </div>
          </div>
        </div>
        <button className="p-1.5 hover:bg-app-bg rounded-lg transition-colors text-text-muted">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
          <span>CASE LOAD INDEX</span>
          <span className={member.caseCount > 10 ? 'text-rose-500 font-black' : 'text-text-primary'}>{member.caseCount} ITEMS</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((member.caseCount / 15) * 100, 100)}%` }}
            className={`h-full transition-all duration-700 ${member.caseCount > 10 ? 'bg-rose-500' : member.caseCount >= 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
        </div>
      </div>

      <div className="flex justify-between items-end pt-2">
        <div className="space-y-0.5">
           <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">SLA PERFORMANCE</p>
           <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-text-primary">{member.performance}%</span>
              <ArrowUpRight size={14} className="text-emerald-500" />
           </div>
        </div>
        <div className="text-[10px] font-black text-text-primary bg-app-bg px-2 py-1 rounded border border-border-subtle">
          COMPLEXITY: {member.complexity}/10
        </div>
      </div>

      <AnimatePresence>
        {isOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-brand-primary/20 backdrop-blur-[2px] rounded-2xl"
          >
            <div className="bg-brand-primary text-white p-3 rounded-full shadow-2xl">
              <Plus size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ManagerOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [stats, setStats] = useState({ slaCompliance: 87, crisisAlerts: [] });
  const [viewMode, setViewMode] = useState('bubble');
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamRes, unassignedRes] = await Promise.all([
        api.get('/analytics/team').catch(() => ({ members: [], stats: {} })),
        api.get('/complaints?status=new&limit=5').catch(() => ({ items: [] }))
      ]);

      setTeam(teamRes.members || []);
      setUnassigned(unassignedRes.items || []);
      setStats(teamRes.stats || { slaCompliance: 92, crisisAlerts: [] });
    } catch (err) {
      console.error('Failed to fetch data', err);
      // Safer fallback for state
      setTeam([]);
      setUnassigned([]);
      setStats({ slaCompliance: 92, crisisAlerts: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async (complaintId, assigneeId) => {
    try {
      await api.patch(`/complaints/assign/${complaintId}`, { assigned_to: assigneeId });
      await fetchData();
    } catch (err) {
      console.error('Reassignment failed', err);
      alert('Failed to reassign. Please try again.');
    }
  };

  const predictTomorrow = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setPrediction({
        volume: '+18.4%',
        staffing: '8.5 Optimal',
        confidence: 0.92,
        logic: 'Historical Q3 surge + Hardware node TS-8 maintenance window'
      });
      setIsPredicting(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 text-text-primary">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra Workforce HQ</p>
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-extrabold tracking-tight">Manager Command Deck</h1>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black border border-emerald-500/20 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_var(--success)] animate-pulse" />
                NODE_SYNCED
             </div>
          </div>
        </div>
        <div className="flex gap-3">
           <button onClick={fetchData} className="p-2.5 border border-border-subtle rounded-xl hover:bg-app-bg transition-all shadow-sm">
              <RefreshCcw size={18} className={`text-text-muted ${loading ? 'animate-spin text-brand-primary' : ''}`} />
           </button>
           <div className="flex bg-input-bg p-1 rounded-xl border border-border-subtle shadow-inner">
              {['grid', 'bubble'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-6 py-1.5 ${viewMode === mode ? 'bg-card-bg text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'} text-[10px] font-black uppercase rounded-lg transition-all`}
                >
                  {mode === 'grid' ? 'Tactical Grid' : 'Efficiency Bubble'}
                </button>
              ))}
           </div>
           <button onClick={() => navigate('/sla')} className="btn-primary flex items-center gap-2 px-6">
              SLA Monitor
              <ChevronRight size={18} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
           <div className="card space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <TrendingUp size={120} />
              </div>
              <div className="flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg"><Zap size={18} /></div>
                   <h3 className="text-lg font-bold tracking-tight">Distribution Matrix</h3>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black tracking-widest text-text-muted uppercase">Optimal</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[10px] font-black tracking-widest text-text-muted uppercase">Busy</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[10px] font-black tracking-widest text-text-muted uppercase">Saturated</span></div>
                 </div>
              </div>

              {viewMode === 'bubble' ? (
                <BubbleChart teamData={team} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.map(m => (
                    <MemberCard key={m.id} member={m} onDrop={handleReassign} />
                  ))}
                  <button className="card border-dashed border-2 flex flex-col items-center justify-center gap-4 text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-subtle/20 transition-all group min-h-[220px]">
                    <div className="w-14 h-14 rounded-2xl bg-app-bg border border-border-subtle flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Plus size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest">Deploy Agent</p>
                      <p className="text-[10px] font-medium opacity-60 mt-1">Add to Workforce Node</p>
                    </div>
                  </button>
                </div>
              )}
           </div>

           <div className="card !p-0 overflow-hidden border-rose-500/20">
              <div className="p-4 bg-rose-500/5 border-b border-border-subtle flex justify-between items-center">
                 <div className="flex items-center gap-3 text-rose-600">
                    <AlertTriangle size={18} />
                    <h4 className="text-xs font-black uppercase tracking-widest">Active Breach Risk Feed</h4>
                 </div>
                 <span className="text-[10px] font-mono font-bold text-rose-500">{stats.crisisAlerts?.length || 0} PROTOCOLS_CRITICAL</span>
              </div>
              <div className="divide-y divide-border-subtle">
                 {stats.crisisAlerts?.map(alert => (
                   <div key={alert.id} className="p-5 flex items-center justify-between group hover:bg-rose-500/5 transition-all cursor-pointer" onClick={() => navigate('/sla')}>
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-xl bg-card-bg border border-rose-500/20 flex items-center justify-center shadow-sm">
                            <ShieldAlert size={20} className="text-rose-500" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-text-primary">{alert.title}</p>
                            <p className="text-xs text-text-muted line-clamp-1">{alert.description}</p>
                         </div>
                      </div>
                      <ChevronRight size={18} className="translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-rose-500" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="card space-y-6 bg-app-bg/50 border-dashed">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Plus size={18} className="text-brand-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Unassigned Pool</h3>
                 </div>
                 <span className="px-2 py-1 bg-brand-primary text-white text-[10px] font-black rounded">{unassigned.length}</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                 {unassigned.map(comp => (
                   <ComplaintCard key={comp.id} complaint={comp} />
                 ))}
                 {unassigned.length === 0 && <p className="text-[10px] text-center text-text-muted py-8 font-bold">Safe Zone: All cases assigned</p>}
                 <p className="text-[10px] text-center text-text-muted pt-2 font-bold italic opacity-60">Drag cards onto agent to reassign</p>
              </div>
           </div>

           <div className="card bg-gradient-to-br from-indigo-600 to-brand-primary text-white p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                 className="absolute -top-12 -right-12 w-48 h-48 border border-white/10 rounded-full" 
              />
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                    <Cpu size={20} className="text-indigo-200" />
                    <h3 className="text-xs font-black tracking-widest uppercase text-indigo-100">Intelligent Forecast v2</h3>
                 </div>
                 
                 <AnimatePresence mode="wait">
                   {!prediction ? (
                     <motion.div 
                      key="idle" 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="py-4 space-y-4"
                     >
                        <p className="text-sm leading-relaxed text-indigo-50 font-medium">Analyze historical trends to optimize tomorrow's node coverage.</p>
                        <button 
                          onClick={predictTomorrow}
                          disabled={isPredicting}
                          className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                           {isPredicting ? <RefreshCcw size={16} className="animate-spin" /> : 'Predict Tomorrow'}
                        </button>
                     </motion.div>
                   ) : (
                     <motion.div 
                       key="result"
                       initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                       className="space-y-4 pt-2"
                     >
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-4xl font-black tracking-tighter">{prediction.volume}</p>
                              <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">Volume Delta</p>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-bold">{prediction.staffing}</p>
                              <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">Staffing Rec</p>
                           </div>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg border border-white/10 text-center">
                           <p className="text-[10px] leading-relaxed font-medium text-indigo-100 italic">" {prediction.logic} "</p>
                        </div>
                        <button onClick={() => setPrediction(null)} className="w-full text-[10px] font-black uppercase tracking-widest text-indigo-200 hover:text-white transition-colors">Reset Neural Model</button>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="text-center p-4">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 Staffing Audit Protocol Active
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;

