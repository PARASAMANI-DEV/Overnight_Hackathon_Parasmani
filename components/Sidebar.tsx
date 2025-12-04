
import React from 'react';
import { LayoutDashboard, Activity, ShieldAlert, Settings, Menu, X, Globe, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onLogout?: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onLogout, currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'traffic', icon: Activity, label: 'Live Traffic' },
    { id: 'map', icon: Globe, label: 'Threat Map' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside
        className={clsx(
          "fixed top-0 left-0 h-full z-40 w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div 
             className="h-20 flex items-center px-6 border-b border-slate-800 cursor-pointer hover:bg-slate-900/50 transition-colors"
             onClick={() => onNavigate('dashboard')}
          >
             <div className="p-2 bg-neon-cyan/10 rounded-lg mr-3">
               <ShieldAlert className="text-cyan-400" size={24} />
             </div>
             <span className="font-bold text-lg tracking-wider text-slate-100">
               SENTINEL
             </span>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false); // Close mobile menu on select
                  }}
                  className={clsx(
                    "flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  )}
                >
                  <item.icon 
                    size={18} 
                    className={clsx("mr-3 transition-colors", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} 
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-4">
            <button 
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-950/30 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Disconnect
            </button>

            <div className="px-2 pb-2">
              <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>SYSTEM ONLINE</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 font-mono">
                v2.4.0-build.89
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
