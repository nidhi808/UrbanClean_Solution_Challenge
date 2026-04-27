import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, trend, trendUp, icon }) => {
  return (
    <div className="glass-panel p-5 relative overflow-hidden group hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-dark-800/80 rounded-lg border border-white/5">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          trend === 'Optimal' ? 'bg-brand-green/10 text-brand-green' :
          trendUp ? 'bg-red-500/10 text-red-400' : 'bg-brand-green/10 text-brand-green'
        }`}>
          {trend !== 'Optimal' && (trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />)}
          {trend}
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</p>
      </div>
      
      {/* Decorative gradient blur in background */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-colors"></div>
    </div>
  );
};

export default StatCard;
