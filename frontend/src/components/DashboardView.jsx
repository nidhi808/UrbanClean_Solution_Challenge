import React from 'react';
import StatCard from './StatCard';
import IssueFeed from './IssueFeed';
import AnalyticsChart from './AnalyticsChart';
import AIRecommendationCard from './AIRecommendationCard';
import { AlertTriangle, MapPin, Zap, AlertCircle, Activity } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const DashboardView = ({ setCurrentView }) => {
  const [stats, setStats] = React.useState({ total: 0, critical: 0, zones: 0 });

  React.useEffect(() => {
    const issuesRef = collection(db, 'issues');
    const unsubscribe = onSnapshot(issuesRef, (snapshot) => {
      const reports = snapshot.docs.map(doc => doc.data());
      const critical = reports.filter(r => r.ai_analysis?.severity === 'high' || r.status === 'pending').length;
      const zones = new Set(reports.map(r => r.location?.split(',')[0])).size;
      
      setStats({
        total: reports.length,
        critical: critical,
        zones: zones
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative z-10">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Issues" 
            value={stats.total.toLocaleString()} 
            trend="+Real-time" 
            trendUp={true}
            icon={<MapPin className="text-brand-blue" size={20} />}
          />
          <StatCard 
            title="Critical Alerts" 
            value={stats.critical.toLocaleString()} 
            trend={stats.critical > 5 ? "High Priority" : "Stable"} 
            trendUp={stats.critical > 5}
            icon={<AlertCircle className="text-red-500" size={20} />}
          />
          <StatCard 
            title="Water Supply" 
            value="94%" 
            trend="Normal" 
            trendUp={true}
            icon={<div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="text-blue-400" size={20} /></div>}
          />
          <StatCard 
            title="Energy Grid" 
            value="82%" 
            trend="Optimized" 
            trendUp={true}
            icon={<div className="p-2 bg-yellow-500/10 rounded-lg"><Zap className="text-yellow-400" size={20} /></div>}
          />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map Preview / Hotspots */}
            <div className="glass-panel p-5 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="text-brand-purple" size={18} />
                  Hotspot Preview
                </h2>
                <button onClick={() => setCurrentView('map')} className="text-xs text-brand-blue hover:text-white transition-colors cursor-pointer">Open Full Map</button>
              </div>
              <div className="h-64 rounded-xl bg-dark-800 border border-white/5 relative overflow-hidden flex items-center justify-center">
                 {/* Mini Map Graphic representation */}
                 <div className="absolute inset-0 opacity-30" style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                  <div className="absolute w-32 h-32 bg-red-500/20 blur-2xl rounded-full"></div>
                  <div className="absolute ml-40 mt-10 w-24 h-24 bg-yellow-400/20 blur-xl rounded-full"></div>
                  
                  {/* Fake markers */}
                  <div className="absolute flex flex-col items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>
                    <span className="text-[10px] bg-dark-900/80 px-2 py-0.5 rounded text-white border border-white/10">Sector 7</span>
                  </div>
              </div>
            </div>
            
            {/* Analytics / Charts */}
            <AnalyticsChart />

          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            <AIRecommendationCard />
            <div className="h-[calc(100%-14rem)] min-h-[400px]">
              <IssueFeed />
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
};

export default DashboardView;
