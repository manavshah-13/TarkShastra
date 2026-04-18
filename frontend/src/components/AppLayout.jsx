import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Settings, 
  ShieldAlert,
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationFeed } from '../frames/NotificationCenter';
import JustificationModal from '../frames/JustificationModal';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
      active 
        ? 'bg-brand-primary text-text-inverse shadow-lg shadow-brand-primary/20' 
        : 'text-text-secondary hover:bg-brand-subtle hover:text-brand-primary'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-text-inverse' : 'text-text-muted group-hover:text-brand-primary'} />
      {label}
    </div>
    {badge && (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const EXECUTIVE_MENU = [
  { id: 'Dashboard', icon: LayoutDashboard, label: 'Executive Pulse', path: '/dashboard' },
  { id: 'Composer', icon: PlusCircle, label: 'Case Creation', path: '/composer' },
  { id: 'Queue', icon: ClipboardList, label: 'Master Queue', path: '/queue' },
  { id: 'Analytics', icon: BarChart3, label: 'Neural Insights', path: '/reports' },
  { id: 'Settings', icon: Settings, label: 'System Control', path: '/settings' },
];

const MANAGER_MENU = [
  { id: 'Manager', icon: LayoutDashboard, label: 'Command Deck', path: '/manager' },
  { id: 'SLA', icon: ShieldAlert, label: 'SLA Sentinel', path: '/sla' },
  { id: 'Queue', icon: ClipboardList, label: 'Workload', path: '/queue' },
  { id: 'Batch', icon: PlusCircle, label: 'Batch Upload', path: '/batch' },
  { id: 'Reports', icon: BarChart3, label: 'Analytics', path: '/reports' },
  { id: 'Settings', icon: Settings, label: 'System Control', path: '/settings' },
];

const QA_MENU = [
  { id: 'QA', icon: LayoutDashboard, label: 'Quality Dashboard', path: '/qa' },
  { id: 'Review', icon: ClipboardList, label: 'Review Queue', path: '/qa/review' },
  { id: 'Trends', icon: BarChart3, label: 'Trends Analysis', path: '/qa/trends' },
  { id: 'Settings', icon: Settings, label: 'System Control', path: '/settings' },
];

export const AppLayout = () => {
  const { user, logout, ROLES } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getMenuItems = () => {
    switch (user?.role) {
      case ROLES.MANAGER:
        return MANAGER_MENU;
      case ROLES.QA:
        return QA_MENU;
      default:
        return EXECUTIVE_MENU;
    }
  };

  const menuItems = getMenuItems();

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'Dashboard';
  };

  const isActiveRoute = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-app-bg transition-colors duration-200">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-sidebar-bg border-r border-border-subtle flex flex-col pt-6 px-4 shrink-0 z-50 transition-all duration-300`}>
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer" onClick={() => navigate('/dashboard')}>
            T
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg tracking-tight text-text-primary">TarkShastra</span>
          )}
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id} 
              icon={item.icon}
              label={sidebarOpen ? item.label : ''}
              active={isActiveRoute(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        <div className="py-6 border-t border-border-subtle">
          <div className="p-3 bg-brand-subtle rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-text-primary">
              {user?.username?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{user?.username || 'User'}</p>
                <p className="text-[10px] text-text-muted truncate capitalize">{user?.role || 'User'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-header-bg border-b border-border-subtle px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-text-muted hover:text-text-primary"
            >
              <Menu size={20} />
            </button>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search ledger, entities, or commands..."
                className="w-full bg-input-bg border border-transparent focus:border-border-subtle focus:bg-card-bg rounded-lg pl-10 pr-4 py-2 text-sm transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <span className="px-1.5 py-0.5 rounded border border-border-subtle bg-app-bg text-[10px] font-mono font-medium text-text-muted">⌘</span>
                <span className="px-1.5 py-0.5 rounded border border-border-subtle bg-app-bg text-[10px] font-mono font-medium text-text-muted">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-8">
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 text-text-muted hover:bg-brand-subtle hover:text-brand-primary rounded-lg transition-colors relative"
            >
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-header-bg" />
            </button>
            <div className="h-6 w-px bg-border-subtle mx-2" />
            <div 
              className="flex items-center gap-3 cursor-pointer group relative"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.username?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={14} className="text-text-muted group-hover:text-text-primary transition-transform" />
              
              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-border-subtle rounded-xl shadow-xl py-2 z-50"
                  >
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-brand-subtle hover:text-brand-primary flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-8 bg-app-bg">
          <Outlet />
        </main>
      </div>

      {/* Notification Overlay */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[100]"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] bg-card-bg border-l border-border-subtle shadow-2xl z-[101]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-brand-subtle rounded-lg transition-colors"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NotificationFeed />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Justification Modal (Global) */}
      <AnimatePresence>
        {showJustification && (
          <JustificationModal onClose={() => setShowJustification(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;