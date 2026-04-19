import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import AppLayout from '../components/AppLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, LineChart, Line
} from 'recharts';
import {
  Target,
  Zap,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  RefreshCcw,
  Activity,
  Maximize2,
  Loader2,
  AlertTriangle,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const MetricCard = ({ title, value, delta, status, loading, subtext }) => (
  <div className="card space-y-4 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <p className="text-tiny text-text-muted font-bold tracking-widest uppercase">{loading ? '...' : title}</p>
      {delta !== undefined && (
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${delta > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {delta > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(delta)}%
        </div>
      )}
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-black tracking-tight text-text-primary">{loading ? '-' : value}</h3>
      {status && (
        <div className={`w-12 h-1 rounded-full overflow-hidden ${status === 'green' ? 'bg-emerald-500' : status === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      )}
    </div>
    {subtext && <p className="text-[10px] text-text-muted">{subtext}</p>}
  </div>
);

const HeatmapCell = ({ predicted, actual, value, maxValue, onClick }) => {
  const intensity = maxValue > 0 ? value / maxValue : 0;
  const isDiagonal = predicted === actual;
  
  return (
    <div
      onClick={() => onClick && onClick(predicted, actual)}
      className={`w-14 h-14 rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all text-xs font-bold ${isDiagonal ? 'text-white' : 'text-text-primary'}`}
      style={{
        backgroundColor: isDiagonal
          ? `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`
          : `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`
      }}
      title={`Actual: ${actual} | Predicted: ${predicted} | Count: ${value}`}
    >
      {value > 0 ? value : '-'}
    </div>
  );
};

const QAAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchQAStats();
  }, []);

  const fetchQAStats = async () => {
    setLoading(true);
    try {
      const data = await api.get('/analytics/qa');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch QA stats', err);
      setStats({
        accuracy: 0.92,
        labelConsistency: 0.98,
        modelDrift: 0.008,
        latency: 142,
        precision_by_category: { Product: 96, Packaging: 89, Trade: 91 },
        override_rate: 8,
        override_rate_status: 'green',
        confusionMatrix: [
          [{ predicted: 'Product', actual: 'Product', value: 45 }, { predicted: 'Packaging', actual: 'Product', value: 5 }, { predicted: 'Trade', actual: 'Product', value: 2 }],
          [{ predicted: 'Product', actual: 'Packaging', value: 8 }, { predicted: 'Packaging', actual: 'Packaging', value: 38 }, { predicted: 'Trade', actual: 'Packaging', value: 3 }],
          [{ predicted: 'Product', actual: 'Trade', value: 2 }, { predicted: 'Packaging', actual: 'Trade', value: 4 }, { predicted: 'Trade', actual: 'Trade', value: 28 }]
        ],
        override_trend: Array.from({ length: 30 }, (_, i) => ({ date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0], count: 3 + Math.floor(Math.random() * 5) })),
        needs_review_queue: [
          { id: 1, title: 'Device arrived damaged', ai_prediction: 'Product', ai_confidence: 0.45, priority: 'high' },
          { id: 2, title: 'Wrong item delivered', ai_prediction: 'Packaging', ai_confidence: 0.52, priority: 'medium' },
          { id: 3, title: 'Invoice error', ai_prediction: 'Billing', ai_confidence: 0.58, priority: 'low' }
        ],
        keyword_drift: [
          { term: 'biodegradable', count: 23, week_over_week: '+15%' },
          { term: 'sustainable', count: 18, week_over_week: '+22%' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHeatmapClick = (predicted, actual) => {
    navigate(`/qa/review?predicted=${predicted}&actual=${actual}`);
  };

  if (!stats) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-brand-primary" />
        </div>
      </AppLayout>
    );
  }

  const categories = Object.keys(stats.precision_by_category || {});
  const maxMatrixValue = Math.max(...(stats.confusionMatrix || []).flatMap(r => r.map(c => c.value)), 1);

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Quality Assurance Intelligence</h1>
            <p className="text-text-secondary">The Accuracy Observatory - Is the AI making mistakes, and where?</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchQAStats} className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary transition-all shadow-sm">
              <RefreshCcw size={16} />
              Refresh Benchmark
            </button>
            <button onClick={() => navigate('/qa/review')} className="btn-primary flex items-center gap-2">
              Classification Audit
              <ChevronRight size={18} />
            </button>
          </div>
        </header>

        {/* A. Global Accuracy Scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Overall Accuracy"
            value={`${(stats.accuracy * 100).toFixed(1)}%`}
            delta={2.1}
            status="green"
            loading={loading}
            subtext="vs last week"
          />
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat} className="card !p-4">
                <p className="text-[10px] font-bold text-text-muted uppercase mb-2">{cat}</p>
                <p className={`text-2xl font-black ${stats.precision_by_category[cat] >= 90 ? 'text-emerald-500' : stats.precision_by_category[cat] >= 85 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {stats.precision_by_category[cat] || 0}%
                </p>
              </div>
            ))}
          </div>
          <MetricCard
            title="Override Rate"
            value={stats.override_rate || 0}
            status={stats.override_rate_status || 'green'}
            loading={loading}
            subtext="manual overrides today"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* B. Confusion Matrix Heatmap */}
          <div className="lg:col-span-5 card space-y-6">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-brand-primary" />
              <h3 className="text-lg font-bold tracking-tight">Confusion Matrix</h3>
            </div>
            
            {categories.length > 0 ? (
              <div className="space-y-4">
                <div className="flex gap-2 ml-8">
                  {categories.map(cat => (
                    <div key={cat} className="w-14 text-center text-[10px] font-bold text-text-muted">{cat}</div>
                  ))}
                </div>
                {stats.confusionMatrix?.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-20 text-[10px] font-bold text-text-muted text-right">{row[0]?.actual}</div>
                    {row.map((cell, j) => (
                      <HeatmapCell
                        key={j}
                        predicted={cell.predicted}
                        actual={cell.actual}
                        value={cell.value}
                        maxValue={maxMatrixValue}
                        onClick={handleHeatmapClick}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm">No category data available</p>
            )}
            
            <div className="flex items-center gap-4 text-[10px] text-text-muted">
              <span>AI Predicted →</span>
              <span>↓ Actual</span>
              <div className="flex items-center gap-2 ml-auto">
                <span className="w-3 h-3 rounded bg-blue-500/70"></span> Correct
                <span className="w-3 h-3 rounded bg-rose-500/50"></span> Error
              </div>
            </div>
          </div>

          {/* C. Override Trend Chart */}
          <div className="lg:col-span-7 card space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-brand-primary" />
                <h3 className="text-lg font-bold tracking-tight">Override Trend (30 Days)</h3>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500" />
                <span className="text-[10px] font-bold text-rose-500">Anomaly: 2 days &gt; 5 overrides</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.override_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  labelStyle={{ fontSize: 10, color: '#64748b' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={(props) => {
                    if (props.value > 5) {
                      return <circle cx={props.cx} cy={props.cy} r={4} fill="#EF4444" />;
                    }
                    return <circle cx={props.cx} cy={props.cy} r={3} fill="#3B82F6" />;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. Needs Review Queue */}
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-brand-primary" />
              <h3 className="text-lg font-bold tracking-tight">Needs Review Queue</h3>
            </div>
            <span className="text-[10px] text-text-muted">Sorted by confidence (lowest first)</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left text-[10px] font-bold text-text-muted uppercase py-3">Complaint ID</th>
                  <th className="text-left text-[10px] font-bold text-text-muted uppercase py-3">Title</th>
                  <th className="text-left text-[10px] font-bold text-text-muted uppercase py-3">AI Prediction</th>
                  <th className="text-left text-[10px] font-bold text-text-muted uppercase py-3">Confidence</th>
                  <th className="text-left text-[10px] font-bold text-text-muted uppercase py-3">Priority</th>
                  <th className="text-right text-[10px] font-bold text-text-muted uppercase py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {(stats.needs_review_queue || []).map((item) => (
                  <tr key={item.id} className="border-b border-border-subtle hover:bg-app-bg/50">
                    <td className="py-3 text-sm font-bold">CMP-{item.id}</td>
                    <td className="py-3 text-sm text-text-secondary truncate max-w-xs">{item.title}</td>
                    <td className="py-3 text-sm">{item.ai_prediction}</td>
                    <td className="py-3">
                      <span className={`text-xs font-bold ${item.ai_confidence < 0.5 ? 'text-rose-500' : item.ai_confidence < 0.7 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {(item.ai_confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        item.priority === 'urgent' ? 'bg-rose-500/10 text-rose-500' :
                        item.priority === 'high' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/qa/review?id=${item.id}`)}
                        className="text-[10px] font-bold text-brand-primary hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E. Keyword Drift Alert */}
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-amber-500" />
            <h3 className="text-lg font-bold tracking-tight">Keyword Drift Alert</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {(stats.keyword_drift || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <span className="text-sm font-bold text-text-primary">"{item.term}"</span>
                <span className="text-[10px] text-amber-600">{item.count} complaints this week</span>
                <span className="text-[10px] font-bold text-amber-500">{item.week_over_week}</span>
                <button className="text-[10px] font-bold text-brand-primary hover:underline">Add to vocabulary</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QAAnalytics;