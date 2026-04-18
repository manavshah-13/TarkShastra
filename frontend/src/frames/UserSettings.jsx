import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Key, 
  Bell, 
  Globe, 
  Cpu, 
  Database, 
  ChevronRight, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff,
  CloudLightning,
  Monitor,
  Moon,
  Sun,
  Lock,
  Zap
} from 'lucide-react';

const SettingsTab = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
      active 
        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' 
        : 'text-text-secondary hover:bg-brand-subtle hover:text-brand-primary'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : 'text-text-muted group-hover:text-brand-primary'} />
    <span className="flex-1 text-left tracking-tight">{label}</span>
    {active && <ChevronRight size={14} className="opacity-60" />}
  </button>
);

const UserSettings = ({ onNext }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [theme, setTheme] = useState('System');

  const tabs = [
    { id: 'Profile', icon: User, label: 'Identity Core' },
    { id: 'Security', icon: Shield, label: 'Security Vault' },
    { id: 'API', icon: Key, label: 'Neural Webhooks' },
    { id: 'Notifications', icon: Bell, label: 'Sentinel Alerts' },
    { id: 'Workspace', icon: Monitor, label: 'Interface Protocol' },
  ];

  return (
    <AppLayout activePage="Settings">
      <div className="max-w-[1400px] mx-auto pb-12 text-text-primary">
        <header className="flex justify-between items-end mb-10">
          <div className="space-y-1">
             <p className="text-tiny">TarkShastra User Matrix</p>
             <h1 className="text-3xl font-extrabold tracking-tight">System Control Panel</h1>
          </div>
          <button onClick={onNext} className="btn-primary flex items-center gap-2 group">
             <Save size={18} className="group-hover:scale-115 transition-transform" />
             Synchronize Config
          </button>
        </header>

        <div className="grid grid-cols-12 gap-10">
           
           {/* Sidebar Navigation */}
           <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="card !p-2 space-y-1 bg-app-bg/50 border-dashed">
                 {tabs.map(tab => (
                   <SettingsTab 
                     key={tab.id} 
                     {...tab} 
                     active={activeTab === tab.id} 
                     onClick={() => setActiveTab(tab.id)} 
                   />
                 ))}
              </div>

              <div className="card bg-rose-500/5 border-rose-500/20 space-y-4">
                 <div className="flex items-center gap-3 text-rose-600">
                    <Trash2 size={18} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Self-Destruct</h3>
                 </div>
                 <p className="text-[10px] text-rose-700 leading-relaxed font-semibold">
                    Purging your identity core will permanently revoke all ledger access and neural keys.
                 </p>
                 <button className="w-full py-2 bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.1em] hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/10">
                    TERMINATE ENTITY
                 </button>
              </div>
           </div>

           {/* Main Settings Area */}
           <div className="col-span-12 lg:col-span-9">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-8"
                 >
                    {activeTab === 'Profile' && (
                       <div className="card space-y-8">
                          <div className="flex items-center gap-6 pb-6 border-b border-border-subtle">
                             <div className="w-20 h-20 rounded-3xl bg-brand-primary flex items-center justify-center text-white text-3xl font-black shadow-2xl relative group cursor-pointer">
                                AR
                                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                   <Globe size={24} />
                                </div>
                             </div>
                             <div>
                                <h3 className="text-xl font-extrabold tracking-tight">Alex Rivera</h3>
                                <p className="text-sm text-text-secondary opacity-80">Principal Operations Architect • Hub-SF</p>
                                <div className="flex gap-2 mt-2">
                                   <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-black uppercase border border-emerald-500/20">Active Node</span>
                                   <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-[9px] font-black uppercase border border-brand-primary/20">Tier 4 Authority</span>
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Display Handle</label>
                                <input type="text" defaultValue="Alex Rivera" className="input-field h-12" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Encrypted Mail</label>
                                <input type="email" defaultValue="arivera@velocity.io" className="input-field h-12" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Operational Role</label>
                                <select className="input-field h-12 appearance-none">
                                   <option>Operations Architect</option>
                                   <option>Neural Auditor</option>
                                   <option>Fleet Manager</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Regional Node</label>
                                <div className="flex gap-2">
                                   <input type="text" defaultValue="USA-WEST-01" className="input-field h-12 flex-1" />
                                   <button className="p-3 bg-app-bg border border-border-subtle rounded-xl text-text-muted hover:text-brand-primary transition-all"><Globe size={18} /></button>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'API' && (
                       <div className="card space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl border border-violet-500/20"><CloudLightning size={24} /></div>
                             <div>
                                <h3 className="text-xl font-extrabold tracking-tight">Neural Webhooks</h3>
                                <p className="text-sm text-text-secondary opacity-80">Interface with TarkShastra's ingest engine programmatically.</p>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="flex items-center justify-between p-6 bg-app-bg rounded-2xl border border-border-subtle group">
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">PROD_AUTH_TOKEN</p>
                                   <div className="flex items-center gap-3 font-mono text-sm">
                                      {showApiKey ? <span>tk_live_882910_fb882a...</span> : <span>••••••••••••••••••••••••••</span>}
                                      <button onClick={() => setShowApiKey(!showApiKey)} className="p-1 text-text-muted hover:text-text-primary">
                                         {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                      </button>
                                   </div>
                                </div>
                                <button className="px-4 py-2 bg-card-bg border border-border-subtle rounded-xl text-[10px] font-black uppercase text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                                   Regenerate
                                </button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 border border-border-subtle rounded-2xl space-y-4 hover:border-brand-primary/30 transition-all">
                                   <div className="flex items-center gap-3 text-brand-primary">
                                      <Database size={18} />
                                      <h4 className="font-bold text-sm">Ingest Webhook</h4>
                                   </div>
                                   <p className="text-[11px] text-text-muted leading-relaxed">Automatic case creation via external secure bridge triggers.</p>
                                   <div className="flex items-center gap-2 pt-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Active Listening</span>
                                   </div>
                                </div>
                                <div className="p-6 border border-border-subtle rounded-2xl space-y-4 hover:border-brand-primary/30 transition-all">
                                   <div className="flex items-center gap-3 text-violet-500">
                                      <Cpu size={18} />
                                      <h4 className="font-bold text-sm">Neural Sync</h4>
                                   </div>
                                   <p className="text-[11px] text-text-muted leading-relaxed">Stream real-time confidence scores and SHAP analysis logs.</p>
                                   <div className="flex items-center gap-2 pt-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Node Dormant</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Workspace' && (
                       <div className="card space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20"><Monitor size={24} /></div>
                             <div>
                                <h3 className="text-xl font-extrabold tracking-tight">Interface Protocol</h3>
                                <p className="text-sm text-text-secondary opacity-80">Optimize the TarkShastra UI according to your operational needs.</p>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="space-y-3">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Neural Theme Engine</label>
                                <div className="grid grid-cols-3 gap-4">
                                   {[
                                     { id: 'Light', icon: Sun, color: 'text-amber-500' },
                                     { id: 'Dark', icon: Moon, color: 'text-blue-500' },
                                     { id: 'System', icon: Monitor, color: 'text-slate-500' }
                                   ].map(t => (
                                     <button 
                                       key={t.id}
                                       onClick={() => setTheme(t.id)}
                                       className={`flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all ${
                                         theme === t.id ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'bg-app-bg border-border-subtle text-text-muted hover:border-brand-primary/50'
                                       }`}
                                     >
                                        <div className={`p-4 rounded-xl ${theme === t.id ? 'bg-white/20' : 'bg-card-bg border border-border-subtle shadow-sm'} ${theme !== t.id ? t.color : ''}`}>
                                           <t.icon size={24} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">{t.id}</span>
                                     </button>
                                   ))}
                                </div>
                             </div>

                             <div className="space-y-3 pt-4">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Visual Density</label>
                                <div className="space-y-4">
                                   <div className="flex justify-between text-xs font-bold text-text-primary px-1">
                                      <span>COMPACT</span>
                                      <span>OPTIMIZED</span>
                                      <span>COMFORT</span>
                                   </div>
                                   <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-border-subtle p-0.5">
                                      <div className="absolute left-[50%] -translate-x-1/2 -top-1.5 w-5 h-5 bg-white border-4 border-brand-primary rounded-full shadow-lg cursor-pointer" />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </motion.div>
              </AnimatePresence>
           </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default UserSettings;
