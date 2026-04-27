import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const AIRecommendationCard = () => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden bg-gradient-to-br from-dark-card via-dark-card to-brand-purple/10 border-brand-purple/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-purple/30 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand-purple/20 text-brand-purple rounded-xl">
          <Sparkles size={20} />
        </div>
        <h3 className="text-white font-bold text-lg">AI Recommendation</h3>
      </div>
      
      <div className="mb-5">
        <p className="text-white text-xl font-medium tracking-tight mb-2">
          Route Optimization Available
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Based on current traffic and 4 new critical pothole detections in Sector 7, rerouting Team Alpha can save <span className="text-brand-green font-semibold">45 minutes</span> and resolve issues 2 hours faster.
        </p>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-brand-purple hover:bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all">
          <Zap size={16} />
          Apply Route
        </button>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors">
          Details
        </button>
      </div>
    </div>
  );
};

export default AIRecommendationCard;
