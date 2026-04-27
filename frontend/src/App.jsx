import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import MapScreen from './components/MapScreen';
import ReportsScreen from './components/ReportsScreen';
import AIInsightsScreen from './components/AIInsightsScreen';
import AlertsScreen from './components/AlertsScreen';
import ReportIssueScreen from './components/ReportIssueScreen';
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import { LogOut, Leaf } from 'lucide-react';

function App() {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('urbanclean_role') || null);
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('urbanclean_view') || 'dashboard');
  const [showLanding, setShowLanding] = useState(!userRole);
  const [autoExecuteMap, setAutoExecuteMap] = useState(false);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('urbanclean_role', userRole);
    } else {
      localStorage.removeItem('urbanclean_role');
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('urbanclean_view', currentView);
  }, [currentView]);

  if (showLanding && !userRole) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  // Layout for Citizens
  if (userRole === 'user') {
    return (
      <div className="flex h-screen bg-dark-900 text-gray-100 overflow-hidden relative">
        <div className="ambient-glow-green top-0 left-0 absolute w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/10 via-dark-900 to-dark-900 pointer-events-none"></div>
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          {/* Simplified Header for Citizen */}
          <header className="h-20 glass-panel border-x-0 border-t-0 rounded-none px-6 lg:px-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-gradient-to-tr from-brand-green to-[#34d399] p-2 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Leaf size={24} className="fill-white/20" />
              </div>
              <span className="font-bold text-xl tracking-tight">UrbanClean <span className="text-sm font-medium text-gray-400">Citizen Portal</span></span>
            </div>
            <button 
              onClick={() => { localStorage.clear(); setUserRole(null); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white glass-button transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </header>
          
          <main className="flex-1 overflow-y-auto">
            <ReportIssueScreen />
          </main>
        </div>
      </div>
    );
  }

  // Layout for Admins
  return (
    <div className="flex h-screen bg-dark-900 text-gray-100 overflow-hidden relative">
      <div className="ambient-glow-blue top-0 left-0"></div>
      <div className="ambient-glow-purple bottom-0 right-0"></div>

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={() => { localStorage.clear(); setUserRole(null); }} />
      
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header />
        
        {currentView === 'dashboard' && <DashboardView setCurrentView={setCurrentView} />}
        {currentView === 'map' && (
          <main className="flex-1 animate-in fade-in zoom-in-95 duration-300 p-4 lg:p-6 pb-0 custom-scrollbar relative z-10">
            <MapScreen autoExecute={autoExecuteMap} />
          </main>
        )}
        {currentView === 'reports' && <ReportsScreen />}
        {currentView === 'insights' && <AIInsightsScreen onExecutePlan={() => { setAutoExecuteMap(true); setCurrentView('map'); }} />}
        {currentView === 'alerts' && <AlertsScreen />}

        
        {/* Placeholder for remaining views */}
        {![ 'dashboard', 'map', 'reports', 'insights', 'alerts', 'report' ].includes(currentView) && (
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-bold mb-2 text-white capitalize">{currentView} Module</h2>
              <p>This module is under development.</p>
            </div>
          </main>
        )}

      </div>
    </div>
  );
}

export default App;
