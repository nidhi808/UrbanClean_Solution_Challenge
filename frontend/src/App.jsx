import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('urbanclean_view') || 'dashboard');
  const [showLanding, setShowLanding] = useState(!userRole);
  const [autoExecuteMap, setAutoExecuteMap] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        localStorage.removeItem('urbanclean_role');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
    localStorage.setItem('urbanclean_role', role);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUserRole(null);
      setCurrentUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
    return <LoginScreen onLogin={handleLogin} />;
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
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-tight">UrbanClean</span>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Welcome, {currentUser?.displayName || 'Citizen'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentUser?.photoURL && (
                <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-full border border-white/10" />
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white glass-button transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
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

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      
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
