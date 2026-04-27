import React from 'react';
import { Sparkles, ArrowRight, Zap, Target, TrendingUp, AlertTriangle, Truck, Activity } from 'lucide-react';

const AIInsightsScreen = ({ onExecutePlan }) => {
  return (
    <div className="flex-1 animate-in fade-in zoom-in-95 duration-300 p-6 lg:p-8 custom-scrollbar relative z-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-brand-purple" size={28} />
            AI Decision Assistant
          </h1>
          <p className="text-gray-400 mt-2">Real-time predictive analysis and smart routing recommendations.</p>
        </div>

        {/* Hero AI Suggestion Card (Visually distinct) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-brand-purple/30 bg-gradient-to-br from-[#120a1f] to-[#1a1025] p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider border border-brand-purple/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse"></span>
                  Top Recommendation
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Deploy Alpha Team to Sector 4 First</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                A critical cluster of 3 severe potholes has been detected on the main transit corridor. Fixing this before 4:00 PM rush hour will prevent massive traffic cascades and reduce vehicle damage reports by an estimated 70%.
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <button 
                onClick={() => onExecutePlan && onExecutePlan()}
                className="w-full md:w-auto bg-brand-purple hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-3 group"
              >
                <Zap className="group-hover:scale-110 transition-transform" />
                Execute Plan
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Ranked Issues and Resource Demand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Priority-Ranked Issues */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-brand-blue" size={20} />
              Priority-Ranked Queue
            </h3>
            
            <div className="space-y-4">
              {[
                { rank: 1, id: 'POT-84', area: 'Sector 4 Corridor', reason: 'High traffic risk', type: 'Critical Potholes' },
                { rank: 2, id: 'WL-12', area: 'Downtown Core', reason: 'Active water leak', type: 'Infrastructure' },
                { rank: 3, id: 'POT-99', area: 'East Suburbs', reason: 'Resident complaints', type: 'Minor Pothole' }
              ].map((item) => (
                <div key={item.rank} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    item.rank === 1 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    item.rank === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'
                  }`}>
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.area}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-brand-purple font-mono tracking-wider">AI Reason</span>
                    <p className="text-xs text-gray-300 font-medium mt-0.5">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predicted Resource Demand */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-brand-green" size={20} />
              Predicted Resource Demand (Next 48h)
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Truck size={16} className="text-brand-blue" />
                      Asphalt & Repair Materials
                    </h4>
                    <p className="text-xs text-gray-400">Projected deficit by tomorrow</p>
                  </div>
                  <span className="text-red-400 font-bold">120% Demand</span>
                </div>
                <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-[95%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <AlertTriangle size={16} className="text-yellow-400" />
                      Maintenance Teams
                    </h4>
                    <p className="text-xs text-gray-400">Current allocation efficiency</p>
                  </div>
                  <span className="text-yellow-400 font-bold">85% Capacity</span>
                </div>
                <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full w-[85%]"></div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-start gap-3">
                <Sparkles size={18} className="text-brand-green mt-0.5" />
                <p className="text-sm text-brand-green leading-relaxed">
                  <strong>AI Insight:</strong> Reallocating Team Delta from Sector 9 to Sector 4 will balance the load and meet the projected 120% material demand efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Anomaly Detection Alerts Section */}
        <div className="glass-panel p-6 border-red-500/20 bg-gradient-to-r from-dark-900 to-red-500/5">
          <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-2">
            <AlertTriangle size={20} />
            AI Anomaly Detection (Real-Time)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-red-500/20">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                <Activity size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight">Water Leakage Detected</h4>
                <p className="text-xs text-gray-400 mt-1">Pressure drop in Sector 7 Mainline. Estimated loss: 120L/min.</p>
              </div>
              <button className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 font-bold uppercase">Dispatch</button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-yellow-500/20">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight">Grid Load Anomaly</h4>
                <p className="text-xs text-gray-400 mt-1">15% sudden spike in Substation 4. Potential overload risk detected.</p>
              </div>
              <button className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30 font-bold uppercase">Balance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsScreen;
