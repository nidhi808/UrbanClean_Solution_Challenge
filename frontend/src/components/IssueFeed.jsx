import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const PriorityBadge = ({ priority }) => {
  const styles = {
    'Critical': 'bg-red-500/10 text-red-400 border-red-500/20',
    'High': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Low': 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
  };
  const label = priority || 'Medium';
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${styles[label] || styles['Medium']}`}>
      {label}
    </span>
  );
}

const IssueFeed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(issuesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((new Date() - date) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          Live Detections
        </h2>
        <span className="bg-white/5 text-gray-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold">
          {issues.length} Active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
            <Loader2 className="animate-spin text-brand-blue" />
            <span className="text-xs">Fetching Firestore data...</span>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-xs text-center p-4">
            No issues reported yet. Real-time feed is ready.
          </div>
        ) : (
          <div className="space-y-1">
            {issues.map((issue) => (
              <div key={issue.id} className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5 group">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {issue.ai_analysis?.severity === 'High' ? (
                      <AlertCircle size={16} className="text-red-400" />
                    ) : (
                      <AlertTriangle size={16} className="text-yellow-400" />
                    )}
                    <span className="font-medium text-sm text-gray-100 group-hover:text-brand-blue transition-colors">
                      {issue.type || 'Urban Issue'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={10} /> {formatTime(issue.timestamp)}
                  </span>
                </div>
                
                <div className="text-[11px] text-gray-400 mb-2 line-clamp-1 italic">{issue.location}</div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={issue.ai_analysis?.severity || 'Medium'} />
                    {issue.ai_analysis?.confidence && (
                      <span className="text-[10px] text-brand-purple font-mono bg-brand-purple/10 px-1.5 py-0.5 rounded">
                        AI: {(issue.ai_analysis.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-tighter ${issue.status === 'pending' ? 'text-orange-400' : 'text-brand-green'}`}>
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/5 bg-dark-800/30">
        <button className="w-full glass-button py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2 hover:bg-brand-blue/20 transition-all">
          Smart Allocation Active
        </button>
      </div>
    </div>
  );
};

export default IssueFeed;
