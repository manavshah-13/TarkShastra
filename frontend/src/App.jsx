import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import AppLayout from './components/AppLayout';
import { useAuth, AuthProvider } from './context/AuthContext';

import AuthGateway from './frames/AuthGateway';
import ExecutiveDashboard from './frames/ExecutiveDashboard';
import ComplaintComposer from './frames/ComplaintComposer';
import AITheater from './frames/AITheater';
import ComplaintDetails from './frames/ComplaintDetails';
import QueueView from './frames/QueueView';
import QAAnalytics from './frames/QAAnalytics';
import ClassificationReview from './frames/ClassificationReview';
import ReportingStudio from './frames/ReportingStudio';
import ManagerOverview from './frames/ManagerOverview';
import SLAMonitor from './frames/SLAMonitor';
import ReportGenerator from './frames/ReportGenerator';
import BatchUpload from './frames/BatchUpload';
import UserSettings from './frames/UserSettings';
import NotificationCenter from './frames/NotificationCenter';
import PublicTracker from './frames/PublicTracker';
import EmailExtractor from './frames/EmailExtractor';
import JustificationModal from './frames/JustificationModal';

import { Sun, Moon } from 'lucide-react';

const ROLES = {
  EXECUTIVE: 'admin',
  MANAGER: 'manager',
  QA: 'analyst',
};

const getDefaultRouteForRole = (role) => {
  switch (role) {
    case ROLES.EXECUTIVE:
      return '/dashboard';
    case ROLES.MANAGER:
      return '/manager';
    case ROLES.QA:
      return '/qa';
    default:
      return '/dashboard';
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [strength, setStrength] = useState(0);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = email.length > 0 && !isValidEmail && !emailFocus;

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
      const userData = await login(email.split('@')[0], password);
      const redirectPath = getDefaultRouteForRole(userData.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setIsError(true);
      setErrorMsg(err.message || 'Authentication Failed');
      setTimeout(() => setIsError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-app-bg transition-colors duration-200">
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

      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md space-y-10">
          <header className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Authentication Gateway</h2>
            <p className="text-text-secondary">Please enter your credentials to access the TarkShastra ledger.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {isError && (
              <div className="fixed top-8 right-8 z-[2000] flex items-center gap-3 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-rose-500/20">
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-tiny">Operations Identity (Email)</label>
                <div className={`relative group transition-all ${showEmailError ? 'ring-2 ring-rose-500/20' : ''}`}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    placeholder="admin@tarkshastra.io"
                    className={`input-field pl-4 h-14 text-base w-full ${showEmailError ? 'border-rose-500 focus:border-rose-500' : ''}`}
                    required
                  />
                </div>
                {showEmailError && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest pl-1">Invalid ID Format</p>}
              </div>

              <div className="space-y-2">
                 <label className="text-tiny">Neural Access Key</label>
                 <div className="relative group">
                   <input 
                     type={showPassword ? 'text' : 'password'} 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••••••"
                     className="input-field pl-4 pr-12 h-14 text-base w-full"
                     required
                   />
                   <button 
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-2 transition-colors"
                   >
                     {showPassword ? 'Hide' : 'Show'}
                   </button>
                 </div>
                 {password.length > 0 && (
                   <div className="flex gap-1.5 pt-1 px-1">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= strength ? (strength <= 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-border-subtle'}`} />
                     ))}
                   </div>
                 )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !isValidEmail}
              className="btn-primary w-full h-14 flex items-center justify-center gap-3 group text-base shadow-xl shadow-brand-primary/20 relative overflow-hidden disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Establish Connection'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => (
  <AuthGuard allowedRoles={allowedRoles}>
    {children}
  </AuthGuard>
);

function AppContent({ theme, toggleTheme }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-[1001] p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-all hover:scale-110"
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} className="text-slate-800" /> : <Sun size={20} className="text-amber-400" />}
      </button>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to={getDefaultRouteForRole(user.role)} replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={user ? <Navigate to={getDefaultRouteForRole(user.role)} replace /> : <LoginPage />} />
        <Route path="/track" element={<PublicTracker />} />

        {/* Protected Routes with Layout */}
        <Route element={<AppLayout />}>
          {/* Executive Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER]}>
              <ExecutiveDashboard />
            </ProtectedRoute>
          } />
          <Route path="/composer" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER]}>
              <ComplaintComposer />
            </ProtectedRoute>
          } />
          
          {/* Shared Routes */}
          <Route path="/ai-review/:complaintId" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER, ROLES.QA]}>
              <AITheater />
            </ProtectedRoute>
          } />
          <Route path="/complaint/:id" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER, ROLES.QA]}>
              <ComplaintDetails />
            </ProtectedRoute>
          } />
          <Route path="/queue" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER, ROLES.QA]}>
              <QueueView />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER, ROLES.QA]}>
              <ReportGenerator />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER, ROLES.QA]}>
              <UserSettings />
            </ProtectedRoute>
          } />

          {/* QA Routes */}
          <Route path="/qa" element={
            <ProtectedRoute allowedRoles={[ROLES.QA, ROLES.MANAGER]}>
              <QAAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/qa/review" element={
            <ProtectedRoute allowedRoles={[ROLES.QA]}>
              <ClassificationReview />
            </ProtectedRoute>
          } />
          <Route path="/qa/trends" element={
            <ProtectedRoute allowedRoles={[ROLES.QA, ROLES.MANAGER]}>
              <ReportingStudio />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <ManagerOverview />
            </ProtectedRoute>
          } />
          <Route path="/sla" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <SLAMonitor />
            </ProtectedRoute>
          } />
          <Route path="/batch" element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <BatchUpload />
            </ProtectedRoute>
          } />

          {/* Email Extractor */}
          <Route path="/email-extractor" element={
            <ProtectedRoute allowedRoles={[ROLES.EXECUTIVE, ROLES.MANAGER]}>
              <EmailExtractor />
            </ProtectedRoute>
          } />
        </Route>

        {/* Justification Modal as standalone route */}
        <Route path="/justification" element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.EXECUTIVE]}>
            <JustificationModal />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App min-h-screen">
          <AppContent theme={theme} toggleTheme={toggleTheme} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;