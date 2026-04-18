import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
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
  Clock,
  Loader2,
  Plus,
  Edit3
} from 'lucide-react';

const ReportingStudio = () => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState('area');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [dateRange, setDateRange] = useState('30D');
  const [metric, setMetric] = useState('volume');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState({});
  const [annotations, setAnnotations] = useState([]);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [annotationText, setAnnotationText] = useState('');

  useEffect(() => {
    fetchTrendsData();
  }, [dateRange, metric]);

  const fetchTrendsData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/analytics/trends?range=${dateRange}&metric=${metric}`);
      setData(response.trends || []);
      setInsights(response.insights || {
        growth: '+14.2%',
        dominant: 'Hardware',
        duration: '14.2h'
      });
      setAnnotations(response.annotations || []);
    } catch (err) {
      console.error('Failed to fetch trends', err);
      // Mock data
      setData([
        { name: 'Mon', hardware: 400, software: 240, billing: 120, total: 760 },
        { name: 'Tue', hardware: 300, software: 139, billing: 98, total: 537 },
        { name: 'Wed', hardware: 200, software: 980, billing: 156, total: 1336 },
        { name: 'Thu', hardware: 278, software: 390, billing: 87, total: 755 },
        { name: 'Fri', hardware: 189, software: 480, billing: 201, total: 870 },
        { name: 'Sat', hardware: 239, software: 380, billing: 134, total: 753 },
        { name: 'Sun', hardware: 349, software: 430, billing: 178, total: 957 },
      ]);
      setInsights({
        growth: '+14.2%',
        dominant: 'Hardware',
        duration: '14.2h'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataPointClick = (dataPoint) => {
    setSelectedDataPoint(dataPoint);
    setShowAnnotationModal(true);
  };

  const handleAnnotationSave = () => {
    if (!annotationText.trim() || !selectedDataPoint) return;

    const newAnnotation = {
      id: Date.now(),
      point: selectedDataPoint.name,
      text: annotationText,
      metric,
      date: new Date().toISOString()
    };

    setAnnotations([...annotations, newAnnotation]);
    setAnnotationText('');
    setSelectedDataPoint(null);
    setShowAnnotationModal(false);

    // In real app, POST to /annotations
    console.log('Saving annotation:', newAnnotation);
  };

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/analytics/export?format=${format}&range=${dateRange}&metric=${metric}`);
      // Trigger download
      const blob = new Blob([response], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarkshastra_report_${dateRange}_${metric}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed');
    }
  };

  const getChartDataKey = () => {
    switch (metric) {
      case 'volume': return 'total';
      case 'resolution_time': return 'resolution_time';
      case 'sla_compliance': return 'sla_rate';
      default: return 'total';
    }
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card-bg p-4 border border-border-subtle rounded-xl shadow-xl">
          <p className="font-bold text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
          <button
            onClick={() => handleDataPointClick(data)}
            className="mt-2 px-3 py-1 bg-brand-primary text-white text-xs rounded hover:bg-brand-hover transition-colors"
          >
            <Plus size={12} className="inline mr-1" />
            Annotate
          </button>
        </div>
      );
    }
    return null;
  };

  return (
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
                    {[
                      { id: 'volume', label: 'Volume', desc: 'Complaint volume over time' },
                      { id: 'resolution_time', label: 'Resolution Time', desc: 'Average time to resolve' },
                      { id: 'sla_compliance', label: 'SLA Compliance', desc: 'Percentage within SLA' },
                      { id: 'category_drift', label: 'Category Drift', desc: 'Category distribution changes' }
                    ].map((m) => (
                      <label key={m.id} className="flex items-center gap-3 p-3 bg-app-bg rounded-xl cursor-pointer hover:bg-brand-subtle transition-colors group border border-transparent hover:border-brand-primary/20">
                         <input
                           type="radio"
                           name="metric"
                           value={m.id}
                           checked={metric === m.id}
                           onChange={() => setMetric(m.id)}
                           className="w-4 h-4 text-brand-primary"
                         />
                         <div className="flex-1">
                           <span className="text-xs font-semibold text-text-primary">{m.label}</span>
                           <p className="text-[10px] text-text-muted">{m.desc}</p>
                         </div>
                      </label>
                    ))}
                 </div>
              </div>

              <div className="pt-8 mt-auto border-t border-border-subtle space-y-3">
                 <button onClick={fetchTrendsData} className="w-full btn-primary flex items-center justify-center gap-2">
                   <Layout size={16} />
                   APPLY SNAPSHOT
                 </button>
                 <div className="space-y-2">
                   <label className="text-tiny">Export Options</label>
                   <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => handleExport('pdf')} className="px-3 py-2 bg-red-500/10 text-red-500 text-xs font-bold rounded hover:bg-red-500/20 transition-colors">
                       PDF
                     </button>
                     <button onClick={() => handleExport('xlsx')} className="px-3 py-2 bg-green-500/10 text-green-500 text-xs font-bold rounded hover:bg-green-500/20 transition-colors">
                       Excel
                     </button>
                   </div>
                 </div>
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
                 <button onClick={() => navigate('/reports')} className="btn-primary flex items-center gap-2">
                    <TrendingUp size={16} />
                    GENERATE PDF
                 </button>
              </div>
           </header>

            <div className="flex-1 p-8 overflow-y-auto space-y-8">
               <div className="card h-[450px] flex flex-col">
                 {loading ? (
                   <div className="flex items-center justify-center h-full">
                     <Loader2 size={32} className="animate-spin text-brand-primary" />
                   </div>
                 ) : (
                   <ResponsiveContainer width="100%" height="100%">
                     {chartType === 'area' ? (
                       <AreaChart data={data}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                         <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                         <Tooltip content={customTooltip} />
                         <Legend iconType="circle" />
                         <Area type="monotone" dataKey={getChartDataKey()} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
                         {metric === 'volume' && (
                           <>
                             <Area type="monotone" dataKey="hardware" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
                             <Area type="monotone" dataKey="software" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                             <Area type="monotone" dataKey="billing" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} />
                           </>
                         )}
                       </AreaChart>
                     ) : chartType === 'bar' ? (
                       <BarChart data={data}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                         <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                         <Tooltip content={customTooltip} />
                         <Bar dataKey={getChartDataKey()} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                     ) : (
                       <LineChart data={data}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                         <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-muted)" />
                         <Tooltip content={customTooltip} />
                         <Line type="monotone" dataKey={getChartDataKey()} stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                       </LineChart>
                     )}
                   </ResponsiveContainer>
                 )}

                 {/* Annotations overlay */}
                 {annotations.map(annotation => (
                   <div key={annotation.id} className="absolute bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-xs text-amber-700 shadow-lg">
                     <Edit3 size={12} className="inline mr-1" />
                     {annotation.text}
                     <div className="text-[10px] opacity-75">Point: {annotation.point}</div>
                   </div>
                 ))}
               </div>

               {/* Annotations List */}
               {annotations.length > 0 && (
                 <div className="card space-y-4">
                   <div className="flex items-center gap-3">
                     <Edit3 size={18} className="text-brand-primary" />
                     <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Chart Annotations</h3>
                   </div>
                   <div className="space-y-3">
                     {annotations.map(annotation => (
                       <div key={annotation.id} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                         <Edit3 size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                         <div className="flex-1">
                           <p className="text-sm text-text-primary">{annotation.text}</p>
                           <p className="text-[10px] text-text-muted">Point: {annotation.point} • {new Date(annotation.date).toLocaleDateString()}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="card space-y-4">
                     <div className="flex items-center gap-3 text-emerald-500">
                        <TrendingUp size={20} />
                        <h3 className="text-sm font-bold tracking-tight uppercase">Growth Velocity</h3>
                     </div>
                     <p className="text-3xl font-black text-text-primary">{insights.growth || '+14.2%'}</p>
                     <p className="text-xs text-text-secondary leading-relaxed">System-wide volume increase compared to the previous 30-day snapshot.</p>
                  </div>
                  <div className="card space-y-4">
                     <div className="flex items-center gap-3 text-brand-primary">
                        <FileText size={20} />
                        <h3 className="text-sm font-bold tracking-tight uppercase">Dominant Tier</h3>
                     </div>
                     <p className="text-3xl font-black text-text-primary">{insights.dominant || 'Hardware'}</p>
                     <p className="text-xs text-text-secondary leading-relaxed">Hardware failure continues to dominate the complaint landscape at 45% of total volume.</p>
                  </div>
                  <div className="card space-y-4">
                     <div className="flex items-center gap-3 text-amber-500">
                        <Clock size={20} />
                        <h3 className="text-sm font-bold tracking-tight uppercase">Mean Duration</h3>
                     </div>
                     <p className="text-3xl font-black text-text-primary">{insights.duration || '14.2h'}</p>
                     <p className="text-xs text-text-secondary leading-relaxed">Resolution time remains stable across all service-level agreements this month.</p>
                  </div>
               </div>

               {/* Comparison Mode Toggle */}
               <div className="card space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Activity size={18} className="text-brand-primary" />
                     <h3 className="text-sm font-bold tracking-tight uppercase text-text-muted">Comparison Mode</h3>
                   </div>
                   <button className="px-4 py-2 bg-brand-primary/10 text-brand-primary text-sm font-bold rounded-lg hover:bg-brand-primary/20 transition-colors">
                     Compare to Previous Period
                   </button>
                 </div>
                 <p className="text-xs text-text-secondary">Enable to overlay previous period data for trend analysis</p>
               </div>
            </div>

            {/* Annotation Modal */}
            <AnimatePresence>
              {showAnnotationModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => setShowAnnotationModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card-bg rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-xl font-bold text-text-primary mb-4">Add Annotation</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Annotate the data point: <strong>{selectedDataPoint?.name}</strong>
                    </p>
                    <textarea
                      value={annotationText}
                      onChange={(e) => setAnnotationText(e.target.value)}
                      placeholder="Enter your annotation..."
                      className="w-full p-3 border border-border-subtle rounded-lg resize-none focus:border-brand-primary transition-colors"
                      rows={3}
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setShowAnnotationModal(false)}
                        className="flex-1 py-2 border border-border-subtle rounded-lg font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAnnotationSave}
                        disabled={!annotationText.trim()}
                        className="flex-1 py-2 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-brand-hover transition-colors disabled:opacity-50"
                      >
                        Save Annotation
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
        </main>
      </div>
  );
};

export default ReportingStudio;
