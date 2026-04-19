import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { 
  User as UserIcon, 
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
  Zap,
  Camera,
  X,
  Upload,
  Check,
  RefreshCcw
} from 'lucide-react';
import { api } from '../lib/api';

const SettingsTab = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all group ${
      active 
        ? 'bg-brand-primary text-white shadow-2xl shadow-brand-primary/30 scale-[1.02]' 
        : 'text-text-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : 'text-text-muted group-hover:text-brand-primary'} />
    <span className="flex-1 text-left">{label}</span>
    {active && <ChevronRight size={14} className="opacity-60" />}
  </button>
);

const UserSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ingestStatus, setIngestStatus] = useState('Healthy');
  const [isTracing, setIsTracing] = useState(false);

  const handleIngestTest = () => {
    if (ingestStatus === 'Verifying...') return;
    setIngestStatus('Verifying...');
    setTimeout(() => setIngestStatus('Healthy'), 2000);
  };

  // Sentinel Alerts State
  const [notifications, setNotifications] = useState([
    { id: 'sla', label: 'SLA Breach Alerts', desc: 'Notify when SLA threshold is exceeded', enabled: true },
    { id: 'critical', label: 'Critical Priority', desc: 'Alerts for urgent and high priority cases', enabled: true },
    { id: 'unassigned', label: 'Unassigned Cases', desc: 'Alert when cases remain unassigned > 1hr', enabled: false },
    { id: 'ai', label: 'AI Confidence', desc: 'Notify on low confidence predictions', enabled: false },
  ]);

  const toggleNotification = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };
  
  // Profile State
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    email: 'arivera@velocity.io',
    role: 'Operations Architect',
    node: 'USA-WEST-01',
    avatar: null
  });

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('ts_theme') || 'Dark');

  // Cropper State
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Debounced auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 1500);
    return () => clearTimeout(timer);
  }, [profile.name, profile.email, profile.role, profile.node]);

  const handleAutoSave = async () => {
    setIsSaving(true);
    try {
      // api.patch('/users/me', profile)
      console.log('Debounced Sync:', profile);
      setTimeout(() => setIsSaving(false), 800);
    } catch (err) {
      console.error('Auto-save failed', err);
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('ts_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme.toLowerCase());
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setProfile({ ...profile, avatar: cropper.getCroppedCanvas().toDataURL() });
      setShowCropper(false);
    }
  };

  const tabs = [
    { id: 'Profile', icon: UserIcon, label: 'Identity Core' },
    { id: 'Security', icon: Shield, label: 'Security Vault' },
    { id: 'API', icon: Key, label: 'Neural Webhooks' },
    { id: 'Notifications', icon: Bell, label: 'Sentinel Alerts' },
    { id: 'Workspace', icon: Monitor, label: 'Interface Protocol' },
  ];

  return (
      <div className="max-w-[1500px] mx-auto pb-12 text-text-primary px-6">
        <header className="flex justify-between items-end mb-12">
          <div className="space-y-1">
             <p className="text-tiny text-text-muted underline decoration-brand-primary decoration-2 underline-offset-4 font-black">TarkShastra User Matrix</p>
             <h1 className="text-4xl font-black tracking-tight">System Control Panel</h1>
          </div>
          <div className="flex items-center gap-6">
             <AnimatePresence>
                {isSaving && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest">
                    <RefreshCcw size={14} className="animate-spin" />
                    Auto-Sync Active
                  </motion.div>
                )}
             </AnimatePresence>
             <button className="btn-primary flex items-center gap-3 px-8 shadow-2xl shadow-brand-primary/30 group" onClick={handleAutoSave}>
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                Commit Config
             </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12">
           
           {/* Sidebar Navigation */}
           <div className="col-span-12 lg:col-span-3 space-y-8">
              <div className="card !p-3 space-y-2 bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[32px]">
                 {tabs.map(tab => (
                    <SettingsTab 
                      key={tab.id} 
                      {...tab} 
                      active={activeTab === tab.id} 
                      onClick={() => setActiveTab(tab.id)} 
                    />
                 ))}
              </div>

              <div className="card bg-rose-500/[0.03] border-rose-500/20 space-y-6 !rounded-[32px] overflow-hidden group">
                 <div className="flex items-center gap-3 text-rose-500">
                    <div className="p-2 bg-rose-500/10 rounded-xl group-hover:scale-110 transition-transform"><Trash2 size={18} /></div>
                    <h3 className="text-xs font-black uppercase tracking-widest">Purge Protocol</h3>
                 </div>
                 <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                    Initiating a self-destruct sequence will permanently wipe your identity core and neural credentials. 
                 </p>
                 <button className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20 active:scale-95">
                    EXECUTE_TERMINATION
                 </button>
              </div>
           </div>

           {/* Main Canvas Area */}
           <div className="col-span-12 lg:col-span-9">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-10"
                 >
                    {activeTab === 'Profile' && (
                       <div className="card space-y-10 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 !p-10 !rounded-[40px]">
                          <div className="flex items-center gap-10 pb-10 border-b border-white/5">
                             <div className="relative group">
                                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-brand-primary to-brand-hover flex items-center justify-center text-white text-4xl font-black shadow-2xl relative overflow-hidden border-2 border-white/10">
                                   {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : 'AR'}
                                   <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer">
                                      <Camera size={28} className="translate-y-2 group-hover:translate-y-0 transition-transform" />
                                      <span className="text-[9px] font-black uppercase tracking-widest mt-2">Update Core</span>
                                      <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                                   </label>
                                </div>
                                <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 border-2 border-[#0F172A] z-10">
                                   <Shield size={20} />
                                </div>
                             </div>
                             <div className="space-y-3">
                                <h3 className="text-3xl font-black tracking-tight text-white">{profile.name}</h3>
                                <p className="text-sm text-text-secondary font-medium tracking-tight opacity-80">{profile.role} • Regional Hub: {profile.node}</p>
                                <div className="flex gap-3 pt-2">
                                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Identity_Synced</span>
                                   </div>
                                   <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                                      <Zap size={10} className="text-brand-primary" fill="currentColor" />
                                      <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Authority_L4</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1">Display Alias</label>
                                <input 
                                  type="text" 
                                  value={profile.name} 
                                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                                  className="w-full h-16 bg-white/5 border-2 border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all shadow-inner" 
                                />
                             </div>
                             <div className="space-y-4">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1">Vault Credentials</label>
                                <input 
                                  type="email" 
                                  value={profile.email} 
                                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                                  className="w-full h-16 bg-white/5 border-2 border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all shadow-inner" 
                                />
                             </div>
                             <div className="space-y-4">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1">Neural Designation</label>
                                <select 
                                  value={profile.role}
                                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                                  className="w-full h-16 bg-white/5 border-2 border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all shadow-inner appearance-none"
                                >
                                   <option>Operations Architect</option>
                                   <option>Neural Auditor</option>
                                   <option>Fleet Manager</option>
                                   <option>System Admin</option>
                                </select>
                             </div>
                             <div className="space-y-4">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1">Geographic Node</label>
                                <div className="relative">
                                   <input 
                                     type="text" 
                                     value={profile.node} 
                                     onChange={(e) => setProfile({...profile, node: e.target.value})}
                                     className="w-full h-16 bg-white/5 border-2 border-slate-800 rounded-2xl px-6 pr-16 text-sm font-bold text-white focus:outline-none focus:border-brand-primary focus:bg-slate-900 transition-all shadow-inner" 
                                   />
                                   <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Workspace' && (
                       <div className="card space-y-12 !p-10 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 !rounded-[40px]">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-amber-500/10 text-amber-500 rounded-3xl border border-amber-500/20 group"><Monitor size={28} className="group-hover:rotate-12 transition-transform" /></div>
                             <div>
                                <h3 className="text-2xl font-black tracking-tight text-white uppercase">Interface Schema</h3>
                                <p className="text-sm text-text-secondary font-medium mt-1">Configure sensory parameters for the TarkShastra HUD.</p>
                             </div>
                          </div>

                          <div className="space-y-10">
                             <div className="space-y-6">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1">Theme Protocol</label>
                                <div className="grid grid-cols-3 gap-6">
                                   {[
                                     { id: 'Light', icon: Sun, color: 'text-amber-500', desc: 'Solar Luminance' },
                                     { id: 'Dark', icon: Moon, color: 'text-indigo-500', desc: 'Deep Space' },
                                     { id: 'System', icon: Monitor, color: 'text-slate-500', desc: 'Hardware Core' }
                                   ].map(t => (
                                     <button 
                                       key={t.id}
                                       onClick={() => handleThemeChange(t.id)}
                                       className={`flex flex-col items-center gap-6 p-8 rounded-[40px] border-2 transition-all group relative overflow-hidden ${
                                         theme === t.id ? 'bg-brand-primary border-brand-primary text-white shadow-2xl shadow-brand-primary/30 scale-[1.05]' : 'bg-app-bg border-slate-800 text-text-muted hover:border-brand-primary/50'
                                       }`}
                                     >
                                        <div className={`p-5 rounded-3xl transition-all shadow-sm ${theme === t.id ? 'bg-white/20' : 'bg-slate-900 border border-white/5'} ${theme !== t.id ? t.color : ''}`}>
                                           <t.icon size={28} />
                                        </div>
                                        <div className="text-center">
                                           <span className="text-xs font-black uppercase tracking-widest block">{t.id}</span>
                                           <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter mt-1 block">{t.desc}</span>
                                        </div>
                                     </button>
                                   ))}
                                </div>
                             </div>

                             <div className="space-y-6 pt-6">
                                <label className="text-tiny font-black text-text-muted uppercase tracking-[0.2em] px-1 flex justify-between">
                                   Visual Density Index <span>NODE: OPTIMIZED</span>
                                </label>
                                <div className="p-8 bg-app-bg rounded-[40px] border border-slate-800">
                                   <div className="flex justify-between text-[10px] font-black text-text-muted h-6 mb-4 px-2 uppercase tracking-widest">
                                      <span className="hover:text-brand-primary transition-colors cursor-pointer">COMPACT</span>
                                      <span className="text-brand-primary">OPTIMIZED</span>
                                      <span className="hover:text-brand-primary transition-colors cursor-pointer">COMFORT</span>
                                   </div>
                                   <div className="relative h-1 w-full bg-slate-800 rounded-full">
                                      <div className="absolute top-0 left-0 h-full w-1/2 bg-brand-primary shadow-[0_0_10px_var(--primary)]" />
                                      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-2xl border-4 border-brand-primary cursor-pointer hover:scale-110 transition-transform" />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'API' && (
                       <div className="card space-y-10 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 !p-10 !rounded-[40px]">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-violet-500/10 text-violet-500 rounded-3xl border border-violet-500/20 group"><CloudLightning size={28} className="group-hover:rotate-12 transition-transform" /></div>
                             <div>
                                <h3 className="text-2xl font-black tracking-tight text-white uppercase">Neural Webhooks</h3>
                                <p className="text-sm text-text-secondary font-medium mt-1">Interface with TarkShastra's ingest engine via secure keys.</p>
                             </div>
                          </div>

                          <div className="space-y-8">
                             <div className="bg-slate-950/80 p-8 rounded-[40px] border border-white/5 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="flex justify-between items-center relative z-10">
                                   <div className="space-y-2">
                                      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Vault_Access_Token</p>
                                      <div className="flex items-center gap-4 font-mono text-sm font-bold text-white">
                                         {showApiKey ? (
                                           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>tk_live_882910_fb882a_vault_s6</motion.span>
                                         ) : (
                                           <span>••••••••••••••••••••••••••••••••••••</span>
                                         )}
                                         <button onClick={() => setShowApiKey(!showApiKey)} className="p-1 text-text-muted hover:text-brand-primary transition-colors">
                                            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                         </button>
                                      </div>
                                   </div>
                                   <div className="flex gap-4">
                                      <button className="px-6 py-3 bg-slate-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-primary transition-all">Copy Key</button>
                                      <button className="px-6 py-3 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">Rotate</button>
                                   </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button 
                                  onClick={handleIngestTest}
                                  className="p-8 bg-app-bg border border-slate-800 rounded-[32px] space-y-4 group hover:border-brand-primary transition-all text-left relative overflow-hidden"
                                >
                                   <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500"><Database size={80} /></div>
                                   <div className="flex items-center gap-4 text-brand-primary relative z-10">
                                      <div className="p-3 bg-brand-primary/10 rounded-2xl"><Database size={20} /></div>
                                      <h4 className="font-extrabold text-sm uppercase tracking-tight">Ingest Webhook</h4>
                                   </div>
                                   <p className="text-[11px] text-text-muted leading-relaxed font-semibold relative z-10">
                                      Synchronize external diagnostic units directly into the neural ledger.
                                   </p>
                                   <div className="flex items-center gap-3 pt-4 relative z-10">
                                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${ingestStatus === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_var(--success)]' : 'bg-brand-primary animate-pulse'}`} />
                                      <span className="text-[9px] font-black text-text-primary uppercase tracking-[0.2em]">
                                        {ingestStatus === 'Healthy' ? 'Node Healthy' : 'Node Verifying...'}
                                      </span>
                                   </div>
                                </button>
                                <button 
                                  onClick={() => setIsTracing(!isTracing)}
                                  className={`p-8 bg-app-bg border rounded-[32px] space-y-4 group transition-all text-left relative overflow-hidden ${isTracing ? 'border-violet-500 shadow-xl shadow-violet-500/10' : 'border-slate-800 hover:border-violet-500'}`}
                                >
                                   <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500"><Cpu size={80} /></div>
                                   <div className="flex items-center gap-4 text-violet-500 relative z-10">
                                      <div className="p-3 bg-violet-500/10 rounded-2xl"><Cpu size={20} /></div>
                                      <h4 className="font-extrabold text-sm uppercase tracking-tight">Trace Listener</h4>
                                   </div>
                                   <p className="text-[11px] text-text-muted leading-relaxed font-semibold relative z-10">
                                      Stream real-time SHAP analysis and model confidence telemetry.
                                   </p>
                                   <div className="flex items-center gap-3 pt-4 relative z-10">
                                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isTracing ? 'bg-violet-500 animate-ping' : 'bg-slate-700'}`} />
                                      <span className="text-[9px] font-black uppercase tracking-[0.2em] transition-colors">
                                        {isTracing ? <span className="text-violet-500">Live Stream Active</span> : <span className="text-text-muted">Bridge Sleep</span>}
                                      </span>
                                   </div>
                                </button>
                             </div>
                          </div>
</div>
                     )}

                    {activeTab === 'Security' && (
                       <div className="card space-y-10 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 !p-10 !rounded-[40px]">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-3xl border border-emerald-500/20 group"><Shield size={28} className="group-hover-rotate-12 transition-transform" /></div>
                             <div>
                                <h3 className="text-2xl font-black tracking-tight text-white uppercase">Security Vault</h3>
                                <p className="text-sm text-text-secondary font-medium mt-1">Manage your security credentials and vault access.</p>
                             </div>
                          </div>

                          <div className="space-y-8">
                             <div className="bg-slate-950/80 p-8 rounded-[40px] border border-white/5">
                                <div className="space-y-4">
                                   <div className="flex justify-between items-center">
                                      <div className="space-y-2">
                                         <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Vault ID</p>
                                         <p className="font-mono text-sm font-bold text-white">VAULT-L8-SECURE</p>
                                      </div>
                                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                             <div className="bg-slate-950/80 p-8 rounded-[40px] border border-white/5">
                                <div className="space-y-4">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Vault Credentials</p>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-bold text-text-muted">API Key</label>
                                         <input type="password" value="••••••••••••••••••••" readOnly className="w-full h-12 bg-white/5 border border-slate-800 rounded-xl px-4 text-sm font-mono text-white" />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-bold text-text-muted">Access Level</label>
                                         <select className="w-full h-12 bg-white/5 border border-slate-800 rounded-xl px-4 text-sm font-bold text-white">
                                            <option>Level 4 - Full Access</option>
                                            <option>Level 3 - Read/Write</option>
                                            <option>Level 2 - Read Only</option>
                                         </select>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Notifications' && (
                       <div className="card space-y-10 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 !p-10 !rounded-[40px]">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-rose-500/10 text-rose-500 rounded-3xl border border-rose-500/20 group"><Bell size={28} className="group-hover:rotate-12 transition-transform" /></div>
                             <div>
                                <h3 className="text-2xl font-black tracking-tight text-white uppercase">Sentinel Alerts</h3>
                                <p className="text-sm text-text-secondary font-medium mt-1">Configure alert thresholds and notification channels.</p>
                             </div>
                          </div>

                          <div className="space-y-6">
                             {notifications.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-950/80 rounded-2xl border border-white/5">
                                   <div className="space-y-1">
                                      <p className="text-sm font-bold text-white">{item.label}</p>
                                      <p className="text-[10px] font-medium text-text-muted">{item.desc}</p>
                                   </div>
                                   <button 
                                      className={`w-12 h-6 rounded-full transition-all ${item.enabled ? 'bg-brand-primary' : 'bg-slate-800'}`}
                                      onClick={() => toggleNotification(item.id)}
                                   >
                                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                   </button>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </motion.div>
               </AnimatePresence>
           </div>
        </div>

      {/* Avatar Cropper Modal */}
      <AnimatePresence>
         {showCropper && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-3xl bg-[#0F172A] rounded-[48px] border border-white/10 overflow-hidden shadow-2xl"
               >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/20"><Camera size={24} /></div>
                        <div>
                           <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity Recalibration</h3>
                           <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Scale and align your neural identifier</p>
                        </div>
                     </div>
                     <button onClick={() => setShowCropper(false)} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <div className="p-10">
                     <Cropper
                        src={image}
                        style={{ height: 400, width: "100%" }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        guides={true}
                        viewMode={1}
                        minCropBoxHeight={100}
                        minCropBoxWidth={100}
                        background={false}
                        autoCropArea={1}
                        checkOrientation={false}
                        onInitialized={(instance) => setCropper(instance)}
                     />
                  </div>
                  <div className="p-8 pt-0 flex gap-4">
                     <button 
                        onClick={() => setShowCropper(false)}
                        className="flex-1 py-4 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                     >
                        Abort Recalibration
                     </button>
                     <button 
                        onClick={getCropData}
                        className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                        Finalize Alignment <Check size={18} />
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
);
};


export default UserSettings;
