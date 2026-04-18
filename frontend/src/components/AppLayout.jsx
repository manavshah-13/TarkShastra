import React from 'react';
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
  ChevronDown
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
      active 
        ? 'bg-brand-primary text-text-inverse shadow-lg shadow-brand-primary/20' 
        : 'text-text-secondary hover:bg-brand-subtle hover:text-brand-primary'
    }`}
  >
    <Icon size={18} className={active ? 'text-text-inverse' : 'text-text-muted group-hover:text-brand-primary'} />
    {label}
  </button>
);

const AppLayout = ({ children, activePage }) => {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Executive Pulse' },
    { id: 'New Complaint', icon: PlusCircle, label: 'Case Creation' },
    { id: 'Complaints', icon: ClipboardList, label: 'Master Queue' },
    { id: 'Analytics', icon: BarChart3, label: 'Neural Insights' },
    { id: 'Monitoring', icon: ShieldAlert, label: 'SLA Sentinel' },
    { id: 'Team', icon: Users, label: 'Workforce Hub' },
    { id: 'Settings', icon: Settings, label: 'System Control' },
  ];

  return (
    <div className="flex h-screen bg-app-bg transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-bg border-r border-border-subtle flex flex-col pt-6 px-4 shrink-0 z-50">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">T</div>
          <span className="font-bold text-lg tracking-tight text-text-primary">TarkShastra</span>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id} 
              {...item} 
              active={activePage === item.id} 
            />
          ))}
        </nav>

        <div className="py-6 border-t border-border-subtle">
           <div className="p-3 bg-brand-subtle rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold text-text-primary truncate">Alex Rivera</p>
                 <p className="text-[10px] text-text-muted truncate">Admin Tier 4</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-header-bg border-b border-border-subtle px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <button className="p-2 -ml-2 text-text-muted hover:text-text-primary lg:hidden">
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
            <button className="p-2 text-text-muted hover:bg-brand-subtle hover:text-brand-primary rounded-lg transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-header-bg" />
            </button>
            <div className="h-6 w-px bg-border-subtle mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">AR</div>
               <ChevronDown size={14} className="text-text-muted group-hover:text-text-primary transition-transform" />
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-8 bg-app-bg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
