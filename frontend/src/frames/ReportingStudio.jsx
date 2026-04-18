import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  Layout, 
  Activity,
  Maximize2,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';

const ReportingStudio = ({ onNext }) => {
  const [chartType, setChartType] = useState('area');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [dateRange, setDateRange] = useState('30D');

  const data = [
    { name: 'Mon', hardware: 400, software: 240, amt: 2400 },
    { name: 'Tue', hardware: 300, software: 139, amt: 2210 },
    { name: 'Wed', hardware: 200, software: 980, amt: 2290 },
    { name: 'Thu', hardware: 278, software: 390, amt: 2000 },
    { name: 'Fri', hardware: 189, software: 480, amt: 2181 },
    { name: 'Sat', hardware: 239, software: 380, amt: 2500 },
    { name: 'Sun', hardware: 349, software: 430, amt: 2100 },
  ];

  return (
    <AppLayout activePage="Analytics">
      <div className="flex h-full -m-8 relative">
        
        {/* Collapsible Filter Panel */}
        <AnimatePresence mode="popLayout">
          {isFilterOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-card-bg border-r border-border-subtle flex flex-col p-6 space-y-8 overflow-hidden shrink-0"
            >
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Filter Studio</h3>
                 <button onClick={() => setIsFilterOpen(false)} className="p-1 hover:bg-app-bg rounded transition-colors text-text-muted">
                   <ChevronLeft size={16} />
                 </button>
              </div>

              <div className="space-y-4">
                 <label className="text-tiny">Date Range Preset</label>
                 <div className="grid grid-cols-2 gap-2">
                    {['7D', '30D', '90D', 'Custom'].map(r => (
                      <button 
                        key={r}
                        onClick={() => setDateRange(r)}
                        className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                          dateRange === r ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-app-bg border-border-subtle text-text-muted hover:border-brand-primary'
                        }`}
                      >
                         {r}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-tiny">Metrics to Plot</label>
                 <div className="space-y-2">
                    {['Volume', 'Resolution Time', 'SLA Compliance', 'Category Drift'].map((m, i) => (
                      <label key={m} className="flex items-center gap-3 p-3 bg-app-bg rounded-xl cursor-pointer hover:bg-brand-subtle transition-colors group border border-transparent hover:border-brand-primary/20">
                         <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-brand-primary shadow-[0_0_5px_var(--primary)]' : 'bg-slate-300 dark:bg-slate-700'}`} />
                         <span className="text-xs font-semibold flex-1 text-text-primary">{m}</span>
                         <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded border-border-subtle accent-brand-primary" />
                      </label>
                    ))}
                 </div>
              </div>

              <div className="pt-8 mt-auto border-t border-border-subtle">
                 <button className="w-full btn-primary flex items-center justify-center gap-2">
                   <Layout size={16} />
                   APPLY SNAPSHOT
                 </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chart Canvas */}
        <main className="flex-1 flex flex-col min-w-0 bg-app-bg relative">
           <header className="h-[72px] bg-card-bg border-b border-border-subtle flex items-center justify-between px-8">
              <div className="flex items-center gap-6">
                 {!isFilterOpen && (
                   <button onClick={() => setIsFilterOpen(true)} className="p-2 border border-border-subtle rounded-lg hover:bg-app-bg transition-all shadow-sm">
                     <Filter size={18} className="text-brand-primary" />
                   </button>
                 )}
                 <div className="space-y-0.5">
                    <h2 className="text-lg font-bold tracking-tight text-text-primary">Reporting Studio</h2>
                    <p className="text-[10px] font-mono text-text-muted">ID: SNAPSHOT_{dateRange}_MARCHv3</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex bg-input-bg p-1 rounded-lg border border-border-subtle">
                    {['area', 'bar', 'line'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setChartType(t)}
                        className={`p-2 rounded-md transition-all ${
                          chartType === t ? 'bg-card-bg text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                        }`}
                      >
                         <Activity size={16} />
                      </button>
                    ))}
                 </div>
                 <div className="h-6 w-px bg-border-subtle mx-2" />
                 <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
                    <Maximize2 size={18} />
                 </button>
                 <button onClick={onNext} className="btn-primary flex items-center gap-2">
                    <TrendingUp size={16} />
                    GENERATE PDF
                 </button>
              </div>
           </header>

           <div className="flex-1 p-8 overflow-y-auto space-y-8">
              <div className="card h-[450px] flex flex-col">
                 <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                      <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend iconType="circle" />
                        <Area type="monotone" dataKey="hardware" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
                        <Area type="monotone" dataKey="software" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={3} />
                      </AreaChart>
                    ) : chartType === 'bar' ? (
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '12px' }} />
                        <Bar dataKey="hardware" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="software" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="hardware" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                        <Line type="monotone" dataKey="software" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                      </LineChart>
                    )}
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="card space-y-4">
                    <div className="flex items-center gap-3 text-emerald-500">
                       <TrendingUp size={20} />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Growth Velocity</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary">+14.2%</p>
                    <p className="text-xs text-text-secondary leading-relaxed">System-wide volume increase compared to the previous 30-day snapshot.</p>
                 </div>
                 <div className="card space-y-4">
                    <div className="flex items-center gap-3 text-brand-primary">
                       <FileText size={20} />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Dominant Tier</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary">Hardware</p>
                    <p className="text-xs text-text-secondary leading-relaxed">Hardware failure continues to dominate the complaint landscape at 45% of total volume.</p>
                 </div>
                 <div className="card space-y-4">
                    <div className="flex items-center gap-3 text-amber-500">
                       <Clock size={20} />
                       <h3 className="text-sm font-bold tracking-tight uppercase">Mean Duration</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary">14.2h</p>
                    <p className="text-xs text-text-secondary leading-relaxed">Resolution time remains stable across all service-level agreements this month.</p>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default ReportingStudio;
