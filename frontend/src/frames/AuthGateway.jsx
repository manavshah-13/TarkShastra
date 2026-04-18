import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AuthGateway = ({ onNext }) => {
  const [role, setRole] = useState('Executive');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-app-bg transition-colors duration-200">
      {/* Branding Section */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-8 max-w-sm">
           <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">T</div>
           <div className="space-y-4">
              <h1 className="text-white text-4xl font-extrabold tracking-tight">TarkShastra</h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Empowering enterprise compliance with AI-driven neural routing and deep sentiment analytics.
              </p>
           </div>
           <div className="flex gap-4 pt-4">
              <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white text-xs font-bold tracking-widest uppercase">NODE_v4.2</div>
              <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white text-xs font-bold tracking-widest uppercase">SSL_ENCRYPTED</div>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md space-y-10">
          <header className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Authentication Gateway</h2>
            <p className="text-text-secondary">Please enter your credentials to access the TarkShastra ledger.</p>
          </header>

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-tiny text-text-muted font-bold tracking-widest uppercase">System Authority Level</label>
              <div className="flex p-1 bg-input-bg rounded-xl border border-border-subtle">
                {['Executive', 'Manager', 'Analyst'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      role === r 
                        ? 'bg-card-bg text-brand-primary shadow-sm ring-1 ring-border-subtle' 
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-tiny">Operations Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@velocity-corp.io"
                    className="input-field pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-tiny">Secret Token</label>
                    <a href="#" className="text-[10px] font-bold text-brand-primary hover:underline">Revoke Access?</a>
                 </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••••••"
                    className="input-field pl-10 pr-12 h-12"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-border-subtle text-brand-primary focus:ring-brand-primary/20" />
              <span className="text-xs text-text-secondary font-medium">Persist internal authority session for 8 hours</span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onNext}
              className="btn-primary w-full h-12 flex items-center justify-center gap-2 group text-base"
            >
              Access System Core
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <footer className="pt-10 flex flex-col items-center gap-6 border-t border-border-subtle">
             <div className="flex items-center gap-3 text-text-muted bg-app-bg px-4 py-2 rounded-full border border-border-subtle">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Verified SSO Provider Active</span>
             </div>
             <div className="flex gap-4">
                {['Google', 'Okta', 'Azure'].map(sso => (
                  <button key={sso} className="px-6 py-2 bg-card-bg border border-border-subtle rounded-lg text-xs font-bold text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-all">
                    {sso}
                  </button>
                ))}
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthGateway;
