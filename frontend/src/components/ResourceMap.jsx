import React from 'react';
import { MapPin, Navigation, Focus } from 'lucide-react';

const ResourceMap = () => {
  return (
    <div className="glass-panel overflow-hidden relative" style={{ height: '350px' }}>
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-dark-900/80 to-transparent">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Navigation size={16} className="text-brand-blue" />
          Resource Allocation Map
        </h2>
        <div className="flex gap-2">
          <button className="bg-dark-800/80 hover:bg-dark-700 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm transition-colors">
            <Focus size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Map visual representation (Mock using css grids and dots) */}
      <div className="w-full h-full bg-[#0a0f18] relative overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Abstract Roads/Paths */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 400">
          <path d="M0 150 Q 200 150 400 250 T 800 200" fill="none" stroke="#3b82f6" strokeWidth="4" />
          <path d="M100 0 L 150 400" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M500 0 L 450 400" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M0 300 Q 300 350 800 100" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Map Markers */}
        <div className="absolute top-[140px] left-[190px] group cursor-pointer">
          <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping"></div>
          <MapPin size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] relative" />
        </div>

        <div className="absolute top-[240px] left-[390px] group cursor-pointer">
           <MapPin size={20} className="text-yellow-400 relative" />
        </div>

        <div className="absolute top-[180px] left-[550px] group cursor-pointer">
          <div className="w-6 h-6 bg-brand-green/20 rounded-full flex items-center justify-center border border-brand-green/50">
            <div className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_#10b981]"></div>
          </div>
          {/* Tooltip visible on hover */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-dark-800 text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Repair Team A
          </div>
        </div>

        <div className="absolute top-[100px] left-[300px]">
           <div className="w-4 h-4 bg-brand-blue/20 rounded-full flex items-center justify-center border border-brand-blue/50">
            <div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 bg-dark-900/80 border border-white/10 p-2.5 rounded-lg backdrop-blur-md flex gap-4 text-[10px] font-medium text-gray-400">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Critical Issue</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-green"></div> Active Team</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-blue border border-brand-blue/50"></div> Sensor Node</div>
      </div>
    </div>
  );
};

export default ResourceMap;
