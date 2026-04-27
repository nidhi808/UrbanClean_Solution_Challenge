import React from 'react';
import { LayoutDashboard, Map, FileText, BellRing, BrainCircuit, LogOut, Leaf, PlusCircle } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <div className="w-64 glass-panel border-y-0 border-l-0 rounded-none hidden md:flex flex-col relative z-20">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-gradient-to-tr from-brand-green to-[#34d399] p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Leaf size={24} className="text-white fill-white/20" />
          </div>
          <span className="font-bold text-xl tracking-tight">UrbanClean</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')}
        />
        <NavItem 
          icon={<Map size={20} />} 
          label="Map" 
          active={currentView === 'map'} 
          onClick={() => setCurrentView('map')}
        />
        <NavItem 
          icon={<FileText size={20} />} 
          label="Reports" 
          active={currentView === 'reports'} 
          onClick={() => setCurrentView('reports')}
        />
        <NavItem 
          icon={<BellRing size={20} />} 
          label="Alerts" 
          badge="3"
          active={currentView === 'alerts'} 
          onClick={() => setCurrentView('alerts')}
        />
        <NavItem 
          icon={<BrainCircuit size={20} />} 
          label="AI Insights" 
          active={currentView === 'insights'} 
          onClick={() => setCurrentView('insights')}
        />

      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gradient-to-r from-brand-blue/20 to-transparent text-brand-blue border-l-2 border-brand-blue' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-brand-blue' : 'text-gray-400 group-hover:text-white'}>{icon}</span>
      <span className={`font-medium text-sm ${active ? 'text-white' : ''}`}>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;
