import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthGateway = ({ onNext, goToFrame }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [strength, setStrength] = useState(0);

  // Email Regex Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = email.length > 0 && !isValidEmail && !emailFocus;

  // Password Strength Logic
  useEffect(() => {
    let s = 0;
    if (password.length > 5) s += 1;
    if (password.length > 10) s += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) s += 1;
    setStrength(s);
  }, [password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Backend expects username, so we send the email prefix or the email itself
      // Based on our seed script, we'll try to map the email to the username
      // For demo, we assume email and username are treated as ID
      const user = await login(email.split('@')[0], password);
      
      // Role-Based Redirect Logic
      if (user.role === 'admin') goToFrame(1); // Executive Dashboard
      else if (user.role === 'manager') goToFrame(9); // Manager Overview
      else goToFrame(6); // QA Analytics (Analyst)
      
    } catch (err) {
      setIsError(true);
      setErrorMsg(err.message || 'Authentication Failed');
      // Clear error after timeout
      setTimeout(() => setIsError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

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

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Failure Toast (Conditional) */}
            <AnimatePresence>
              {isError && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="fixed top-8 right-8 z-[2000] flex items-center gap-3 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-rose-500/20"
                >
                  <AlertCircle size={20} />
                  <span className="text-sm font-bold">{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-tiny">Operations Identity (Email)</label>
                <div className={`relative group transition-all ${showEmailError ? 'ring-2 ring-rose-500/20' : ''}`}>
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${showEmailError ? 'text-rose-500' : 'text-text-muted group-focus-within:text-brand-primary'}`} size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    placeholder="admin@tarkshastra.io"
                    className={`input-field pl-12 h-14 text-base ${showEmailError ? 'border-rose-500 focus:border-rose-500' : ''}`}
                    required
                  />
                </div>
                {showEmailError && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest pl-1">Invalid ID Format</p>}
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-tiny">Neural Access Key</label>
                    <a href="#" className="text-[10px] font-bold text-brand-primary hover:underline">Reset Token</a>
                 </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input-field pl-12 pr-12 h-14 text-base"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-2 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength Indicator */}
                {password.length > 0 && (
                  <div className="flex gap-1.5 pt-1 px-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= strength ? (strength <= 2 ? 'bg-amber-500 shadow-[0_0_8px_var(--warning)]' : 'bg-emerald-500 shadow-[0_0_8px_var(--success)]') : 'bg-border-subtle'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-border-subtle text-brand-primary focus:ring-brand-primary/20 cursor-pointer" />
              <span className="text-xs text-text-secondary font-medium">Persist gateway authority for 8h</span>
            </div>

            <motion.button 
              type="submit"
              disabled={isLoading || !isValidEmail}
              animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full h-14 flex items-center justify-center gap-3 group text-base shadow-xl shadow-brand-primary/20 relative overflow-hidden disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Establish Connection
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

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
