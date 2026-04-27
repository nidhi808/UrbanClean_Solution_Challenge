import React, { useState, useEffect } from 'react';
import { AlertOctagon, AlertTriangle, Info, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

const initialAlerts = [
  { id: 1, type: 'critical', title: 'Severe Pothole Cluster', location: 'Main St & 5th Ave', time: 'Just now', isNew: true },
  { id: 2, type: 'high', title: 'Water Main Leak Suspected', location: 'Downtown Sector', time: '12 mins ago', isNew: false },
  { id: 3, type: 'medium', title: 'Streetlight Outage', location: 'Riverside Walk', time: '1 hr ago', isNew: false },
  { id: 4, type: 'low', title: 'Minor Surface Cracks', location: 'Industrial Park', time: '3 hrs ago', isNew: false },
];

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  // Remove the 'new' pulse animation after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(alerts.map(a => ({ ...a, isNew: false })));
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical':
        return { wrapper: 'bg-red-500/5 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]', icon: <AlertOctagon className="text-red-500" />, textColor: 'text-red-400' };
      case 'high':
        return { wrapper: 'bg-orange-500/5 border-orange-500/30', icon: <AlertTriangle className="text-orange-400" />, textColor: 'text-orange-400' };
      case 'medium':
        return { wrapper: 'bg-yellow-500/5 border-yellow-500/30', icon: <AlertTriangle className="text-yellow-400" />, textColor: 'text-yellow-400' };
      case 'low':
      default:
        return { wrapper: 'bg-brand-blue/5 border-brand-blue/30', icon: <Info className="text-brand-blue" />, textColor: 'text-brand-blue' };
    }
  };

  return (
    <div className="flex-1 animate-in fade-in zoom-in-95 duration-300 p-6 lg:p-8 custom-scrollbar relative z-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Real-Time Alerts
            <span className="bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded-full">3 Critical</span>
          </h1>
          <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <CheckCircle2 size={16} /> Mark all read
          </button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.type);
            return (
              <div 
                key={alert.id} 
                className={`relative overflow-hidden p-5 rounded-xl border transition-all duration-500 ${styles.wrapper} ${alert.isNew ? 'animate-pulse-slow' : 'hover:bg-white/5'}`}
              >
                {/* Glow for new critical alerts */}
                {alert.isNew && alert.type === 'critical' && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-3xl pointer-events-none rounded-full"></div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center relative z-10">
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {styles.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white text-lg">{alert.title}</h3>
                        {alert.isNew && <span className="bg-brand-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {alert.location}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {alert.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 sm:ml-auto">
                    {alert.type === 'critical' && (
                      <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        Dispatch Team
                      </button>
                    )}
                    <button className="glass-button px-4 py-2 text-white text-sm font-medium flex items-center gap-2">
                      Review <ChevronRight size={16} className="opacity-50" />
                    </button>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertsScreen;
